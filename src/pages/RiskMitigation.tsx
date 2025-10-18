import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const RiskMitigation = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-20">
      <div className="max-w-2xl mx-auto px-6 pt-6">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            {t('riskMitigation.title')}
          </h1>
        </div>

        {/* Content */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-lg space-y-6">
          <p className="text-foreground/90 leading-relaxed">
            Welcome to Perkloop. Our service aims to provide high returns by participating in Decentralized Finance (DeFi) lending. Before investing, you must understand the risks as well as our commitment to risk mitigation.
          </p>

          <div className="bg-destructive/10 border-2 border-destructive/30 rounded-2xl p-4">
            <p className="text-destructive font-semibold text-center">
              Your principal is NOT insured by the Japanese government or any bank.
            </p>
          </div>

          {/* Risk 1 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">
              1. Code Exploit Risk (Theft)
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              Your money is managed by automated, public software (called smart contracts). Flaws in this code can be exploited by hackers, leading to the potential loss of up to 100% of your invested principal.
            </p>
            
            <div className="pl-4 border-l-4 border-primary/30 space-y-2">
              <h3 className="font-semibold text-primary text-lg">Mitigation</h3>
              <p className="text-foreground/80 leading-relaxed">
                We establish multiple layers of defense to protect your investment:
              </p>
              <ul className="space-y-2 text-foreground/80 leading-relaxed">
                <li>
                  <span className="font-semibold">Triple Audited System:</span> We invest in high-quality security audits every quarter and deploy assets across 2-3 separate, highly reputable lending protocols (measured by size and stability) on Sui, a blockchain created by a safe programming language.
                </li>
                <li>
                  <span className="font-semibold">Investor Protection Fund (IPF):</span> We establish the Investor Protection Fund (IPF), backed by our firm's segregated capital, to cover 20% of your loss if a hack occurs. This is your immediate safety net.
                </li>
                <li>
                  <span className="font-semibold">Commitment to Full Recovery:</span> In the case of a hack, we will immediately engage with the L1 chain foundation (e.g., the Sui Foundation) and the protocol's governance community (DAO), deploying our full legal and technical efforts to lobby for, and maximize the chances of, a community-funded asset recovery or reimbursement. Historically, leading L1 chains and protocols have initiated actions to recover and reimburse lost investor capital, and we commit to acting as your relentless advocate to secure any and all available external recovery.
                </li>
              </ul>
            </div>
          </div>

          {/* Risk 2 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">
              2. Exchange Rate Risk
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              Your deposit is converted to US Dollar stablecoins to earn yield. If the Japanese Yen strengthens when you withdraw, the amount of JPY you receive back may be less than your original deposit. That said, if Yen weakens when you withdraw, you will receive more Yen than your initial deposit.
            </p>
            
            <div className="pl-4 border-l-4 border-primary/30 space-y-2">
              <h3 className="font-semibold text-primary text-lg">Mitigation</h3>
              <p className="text-foreground/80 leading-relaxed">
                We show you this real-time risk via our Red/Green indicator. You bear this currency risk, but in exchange, you receive the full potential of the high global yield alongside the possibility to gain extra return from currency fluctuations.
              </p>
            </div>
          </div>

          {/* Risk 3 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">
              3. Stablecoin Reserve Risk
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              Although rare, the stablecoins can lose its peg due to reserve insolvency or banking crises, which can result in the loss of your principal.
            </p>
            
            <div className="pl-4 border-l-4 border-primary/30 space-y-2">
              <h3 className="font-semibold text-primary text-lg">Mitigation</h3>
              <p className="text-foreground/80 leading-relaxed">
                All funds will only be converted to USDC, the single-most secured, compliant, and reputable USD-pegged stablecoin among all, to minimize depegging risks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMitigation;
