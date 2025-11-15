import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

const RiskMitigation = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-20">
      <div className="max-w-2xl mx-auto px-6 pt-6">
        {/* Header with Back Button and Language Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <LanguageSelector />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('riskMitigation.title')}
          </h1>
        </div>

        {/* Content */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-lg space-y-6">
          <p className="text-foreground/90 leading-relaxed">
            {t('riskMitigation.intro')}
          </p>

          <div className="bg-destructive/10 border-2 border-destructive/30 rounded-2xl p-4">
            <p className="text-destructive font-semibold text-center">
              {t('riskMitigation.warning')}
            </p>
          </div>

          {/* Risk 1 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">
              {t('riskMitigation.risk1.title')}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {t('riskMitigation.risk1.description')}
            </p>
            
            <div className="pl-4 border-l-4 border-green-500 space-y-2">
              <h3 className="font-semibold text-green-600 dark:text-green-400 text-lg">{t('riskMitigation.risk1.mitigation')}</h3>
              <p className="text-foreground/80 leading-relaxed">
                {t('riskMitigation.risk1.mitigationIntro')}
              </p>
              <ul className="space-y-2 text-foreground/80 leading-relaxed">
                <li>
                  <span className="font-semibold">{t('riskMitigation.risk1.mitigation1.title')}</span> {t('riskMitigation.risk1.mitigation1.text')}
                </li>
                <li>
                  <span className="font-semibold">{t('riskMitigation.risk1.mitigation2.title')}</span> {t('riskMitigation.risk1.mitigation2.text')}
                </li>
                <li>
                  <span className="font-semibold">{t('riskMitigation.risk1.mitigation3.title')}</span> {t('riskMitigation.risk1.mitigation3.text')}
                </li>
              </ul>
            </div>
          </div>

          {/* Risk 2 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">
              {t('riskMitigation.risk2.title')}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {t('riskMitigation.risk2.description')}
            </p>
            
            <div className="pl-4 border-l-4 border-green-500 space-y-2">
              <h3 className="font-semibold text-green-600 dark:text-green-400 text-lg">{t('riskMitigation.risk2.mitigation')}</h3>
              <p className="text-foreground/80 leading-relaxed">
                {t('riskMitigation.risk2.mitigationText')}
              </p>
            </div>
          </div>

          {/* Risk 3 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">
              {t('riskMitigation.risk3.title')}
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              {t('riskMitigation.risk3.description')}
            </p>
            
            <div className="pl-4 border-l-4 border-green-500 space-y-2">
              <h3 className="font-semibold text-green-600 dark:text-green-400 text-lg">{t('riskMitigation.risk3.mitigation')}</h3>
              <p className="text-foreground/80 leading-relaxed">
                {t('riskMitigation.risk3.mitigationText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMitigation;
