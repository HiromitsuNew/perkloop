import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Egg, Milk, Container, Beer, Wheat, Cigarette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import lifeLogo from "@/assets/life-logo.png";

const PickPurchase = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedStore, setSelectedStore] = React.useState<string | null>(null);

  return <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Language Selector */}
        <div className="flex justify-end">
          <LanguageSelector />
        </div>
        
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-medium">{t('pickPurchase.title1')}</h1>
            <h2 className="text-lg font-medium">
              {t('pickPurchase.title2')} <span className="text-accent">{t('pickPurchase.title2.money')}</span> {t('pickPurchase.title2.rest')}
            </h2>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h3 className="text-base font-medium">{t('pickPurchase.pick')}</h3>
          
          {/* Store Filter */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setSelectedStore(selectedStore === 'life' ? null : 'life')}
              className={`rounded-lg p-2 transition-all duration-300 border-2 ${
                selectedStore === 'life' || selectedStore === null
                  ? 'bg-primary/10 border-primary shadow-md scale-105'
                  : 'bg-card border-border opacity-50 hover:opacity-100'
              }`}
            >
              <img src={lifeLogo} alt="Life" className="w-8 h-8" />
            </button>
          </div>
        </div>

        {/* Purchase Options */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="bg-card border-border p-6 cursor-pointer hover:bg-muted/50 transition-colors relative" 
            onClick={() => navigate('/decide-deposit', { 
              state: { 
                product: 'yogurt',
                price: 180,
                icon: 'Container'
              }
            })}
          >
            <div className="text-center space-y-3">
              <Container className="w-8 h-8 mx-auto text-foreground" />
              <div>
                <p className="font-medium">{t('pickPurchase.yogurt')}</p>
                <p className="text-sm text-muted-foreground">￥180</p>
              </div>
            </div>
            <img src={lifeLogo} alt="Life" className="absolute bottom-2 right-2 w-8 h-8 opacity-70" />
          </Card>

          <Card 
            className="bg-card border-border p-6 cursor-pointer hover:bg-muted/50 transition-colors relative" 
            onClick={() => navigate('/decide-deposit', { 
              state: { 
                product: 'milk',
                price: 248,
                icon: 'Milk'
              }
            })}
          >
            <div className="text-center space-y-3">
              <Milk className="w-8 h-8 mx-auto text-foreground" />
              <div>
                <p className="font-medium">{t('pickPurchase.milk')}</p>
                <p className="text-sm text-muted-foreground">￥248</p>
              </div>
            </div>
            <img src={lifeLogo} alt="Life" className="absolute bottom-2 right-2 w-8 h-8 opacity-70" />
          </Card>

          <Card 
            className="bg-card border-border p-6 cursor-pointer hover:bg-muted/50 transition-colors relative" 
            onClick={() => navigate('/decide-deposit', { 
              state: { 
                product: 'eggs',
                price: 343,
                icon: 'Egg'
              }
            })}
          >
            <div className="text-center space-y-3">
              <Egg className="w-8 h-8 mx-auto text-foreground" />
              <div>
                <p className="font-medium">{t('pickPurchase.eggs')}</p>
                <p className="text-sm text-muted-foreground">￥343</p>
              </div>
            </div>
            <img src={lifeLogo} alt="Life" className="absolute bottom-2 right-2 w-8 h-8 opacity-70" />
          </Card>

          <Card 
            className="bg-card border-border p-6 cursor-pointer hover:bg-muted/50 transition-colors relative" 
            onClick={() => navigate('/decide-deposit', { 
              state: { 
                product: 'cigarette',
                price: 580,
                icon: 'Cigarette'
              }
            })}
          >
            <div className="text-center space-y-3">
              <Cigarette className="w-8 h-8 mx-auto text-foreground" />
              <div>
                <p className="font-medium">{t('pickPurchase.cigarette')}</p>
                <p className="text-sm text-muted-foreground">￥580</p>
              </div>
            </div>
            <img src={lifeLogo} alt="Life" className="absolute bottom-2 right-2 w-8 h-8 opacity-70" />
          </Card>

          <Card 
            className="bg-card border-border p-6 cursor-pointer hover:bg-muted/50 transition-colors relative" 
            onClick={() => navigate('/decide-deposit', { 
              state: { 
                product: 'beer',
                price: 1280,
                icon: 'Beer'
              }
            })}
          >
            <div className="text-center space-y-3">
              <Beer className="w-8 h-8 mx-auto text-foreground" />
              <div>
                <p className="font-medium">{t('pickPurchase.beer')}</p>
                <p className="text-sm text-muted-foreground">￥1,280</p>
              </div>
            </div>
            <img src={lifeLogo} alt="Life" className="absolute bottom-2 right-2 w-8 h-8 opacity-70" />
          </Card>

          <Card 
            className="bg-card border-border p-6 cursor-pointer hover:bg-muted/50 transition-colors relative" 
            onClick={() => navigate('/decide-deposit', { 
              state: { 
                product: 'rice',
                price: 2795,
                icon: 'Wheat'
              }
            })}
          >
            <div className="text-center space-y-3">
              <Wheat className="w-8 h-8 mx-auto text-foreground" />
              <div>
                <p className="font-medium">{t('pickPurchase.rice')}</p>
                <p className="text-sm text-muted-foreground">￥2,795</p>
              </div>
            </div>
            <img src={lifeLogo} alt="Life" className="absolute bottom-2 right-2 w-8 h-8 opacity-70" />
          </Card>
        </div>
      </div>
    </div>;
};
export default PickPurchase;