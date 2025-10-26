import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useExchangeRate } from '@/hooks/useExchangeRate';

const Withdraw = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState<'returns' | 'principals' | null>(null);
  const [frequency, setFrequency] = useState([2]); // Default to monthly (index 2)
  const [isSaving, setIsSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    jpy_deposit: number;
    withdrawal_principal_usd: number;
  } | null>(null);
  const { rate: currentRate, loading: rateLoading } = useExchangeRate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('jpy_deposit, withdrawal_principal_usd')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      setUserProfile(data);
    };

    if (selectedOption === 'principals') {
      fetchUserProfile();
    }
  }, [user, selectedOption]);

  const frequencyOptions = [
    t('withdraw.weekly'),
    t('withdraw.biweekly'),
    t('withdraw.monthly'),
    t('withdraw.quarterly'),
  ];
  
  const frequencyValues = ['weekly', 'biweekly', 'monthly', 'quarterly'];

  const handleBack = () => {
    if (selectedOption) {
      setSelectedOption(null);
    } else {
      navigate('/');
    }
  };

  const handleConfirm = async () => {
    if (!user || !selectedOption) return;

    setIsSaving(true);
    try {
      const preferenceData = {
        user_id: user.id,
        withdrawal_type: selectedOption,
        frequency: selectedOption === 'returns' ? frequencyValues[frequency[0]] : null,
      };

      // Use upsert to insert or update existing preference
      const { error } = await supabase
        .from('withdrawal_preferences')
        .upsert(preferenceData, {
          onConflict: 'user_id,withdrawal_type'
        });

      if (error) throw error;

      toast({
        title: t('withdraw.success'),
        description: t('withdraw.successDescription'),
      });

      // Navigate back to dashboard after short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error saving withdrawal preference:', error);
      toast({
        title: t('withdraw.error'),
        description: t('withdraw.errorDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 p-4">
      <div className="max-w-md mx-auto space-y-6 pt-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{t('withdraw.title')}</h1>
        </div>

        {!selectedOption ? (
          /* Initial Options */
          <div className="space-y-4">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">{t('withdraw.selectOption')}</h2>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => setSelectedOption('returns')}
                >
                  {t('withdraw.returns')}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => setSelectedOption('principals')}
                >
                  {t('withdraw.principals')}
                </Button>
              </div>
            </Card>
          </div>
        ) : selectedOption === 'returns' ? (
          /* Withdrawal Frequency Slider */
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">{t('withdraw.frequencyTitle')}</h2>
              <p className="text-sm text-muted-foreground mb-6">
                {t('withdraw.frequencyDescription')}
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Slider
                  value={frequency}
                  onValueChange={setFrequency}
                  min={0}
                  max={3}
                  step={1}
                  className="w-full"
                />
                <div className="text-center">
                  <p className="text-xl font-semibold text-primary">
                    {frequencyOptions[frequency[0]]}
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('withdraw.compoundingNote')}
                </p>
              </div>

              <Button 
                size="lg" 
                className="w-full"
                onClick={handleConfirm}
                disabled={isSaving}
              >
                {isSaving ? t('withdraw.saving') : t('withdraw.confirm')}
              </Button>
            </div>
          </Card>
        ) : (
          /* Withdraw Principal */
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">{t('withdraw.principalsTitle')}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Full withdrawal will be initiated within 48 hours.
              </p>
            </div>

            {userProfile && currentRate && !rateLoading && (
              <div className="space-y-4 bg-muted/30 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Original Deposit (JPY)</span>
                    <span className="font-semibold">¥{userProfile.jpy_deposit.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Exchange Rate at Deposit</span>
                    <span className="font-semibold">
                      ¥{(userProfile.jpy_deposit / userProfile.withdrawal_principal_usd).toFixed(2)} / USD
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Exchange Rate</span>
                    <span className="font-semibold">¥{currentRate.toFixed(2)} / USD</span>
                  </div>
                  
                  <div className="h-px bg-border my-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Withdrawal Amount (JPY)</span>
                    <span className="text-lg font-bold text-primary">
                      ¥{(userProfile.withdrawal_principal_usd * currentRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {rateLoading && (
              <div className="text-center text-sm text-muted-foreground py-4">
                Loading exchange rate...
              </div>
            )}

            <div className="space-y-4 text-sm">
              <div>
                <h3 className="text-base font-bold mb-2">
                  Why is my Withdrawal Amount different from my Original Deposit?
                </h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    Perkloop converts your JPY into USD stablecoin to generate returns, so your withdraw amount is affected by interest rate fluctuation.
                  </p>
                  <p>
                    If JPY strengthens after you made your deposit, you will end up withdrawing less than your principal.
                  </p>
                  <p>
                    If JPY weakens after you made your deposit, you will end up withdrawing more than your principal.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-2">
                  What if my withdrawal of principal is less than my original deposit?
                </h4>
                <p className="text-muted-foreground">
                  One option is that you simply wait and delay your withdrawal until JPY weakens against USD. You will be able to withdraw more principal (even higher than your original deposit).
                </p>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full"
              onClick={handleConfirm}
              disabled={isSaving || rateLoading}
            >
              {isSaving ? t('withdraw.saving') : t('withdraw.confirm')}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Withdraw;
