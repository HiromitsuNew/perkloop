import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Investment {
  id: string;
  product_name: string;
  deposit_amount: number;
  investment_days: number;
  payment_method: string;
  status: string;
  created_at: string;
  returns: number;
}

export const useInvestments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchInvestments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['pending', 'active'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvestments(data || []);
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const createInvestment = async (investmentData: {
    product_name: string;
    deposit_amount: number;
    investment_days: number;
    payment_method: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('investments')
      .insert({
        user_id: user.id,
        ...investmentData,
      })
      .select()
      .single();

    if (error) throw error;
    
    // Refresh investments list
    fetchInvestments();
    return data;
  };

  const updateInvestment = async (
    investmentId: string,
    updateData: {
      deposit_amount: number;
      investment_days: number;
    }
  ) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('investments')
      .update({
        ...updateData,
        created_at: new Date().toISOString(), // Reset the countdown
      })
      .eq('id', investmentId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    
    // Refresh investments list
    fetchInvestments();
    return data;
  };

  const deleteAllInvestments = async () => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('investments')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;
    
    // Refresh investments list
    fetchInvestments();
  };

  useEffect(() => {
    fetchInvestments();
  }, [user]);

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.deposit_amount, 0);
  const totalReturns = investments.reduce((sum, inv) => sum + (inv.returns || 0), 0);

  return {
    investments,
    loading,
    createInvestment,
    updateInvestment,
    deleteAllInvestments,
    fetchInvestments,
    totalInvestment,
    totalReturns,
  };
};