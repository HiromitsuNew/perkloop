import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Withdraw = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState<'returns' | 'principles' | null>(null);
  const [frequency, setFrequency] = useState([2]); // Default to monthly (index 2)
  const [isSaving, setIsSaving] = useState(false);

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
                  onClick={() => setSelectedOption('principles')}
                >
                  {t('withdraw.principles')}
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
          /* Withdraw Principles */
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">{t('withdraw.principlesTitle')}</h2>
              <p className="text-sm text-muted-foreground">
                {t('withdraw.principlesDescription')}
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
          </Card>
        )}
      </div>
    </div>
  );
};

export default Withdraw;
