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
        .eq('status', 'active')
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

  useEffect(() => {
    fetchInvestments();
  }, [user]);

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.deposit_amount, 0);

  return {
    investments,
    loading,
    createInvestment,
    fetchInvestments,
    totalInvestment,
  };
};