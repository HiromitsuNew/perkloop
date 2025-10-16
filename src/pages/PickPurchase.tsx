import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Egg, Milk, Container, Beer, Wheat, Cigarette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import lifeLogo from "@/assets/life-logo.png";
import sevenElevenLogo from "@/assets/seven-eleven-logo.png";

const PickPurchase = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedStore, setSelectedStore] = React.useState<string | null>(null);

  // Define products with their store associations
  const allProducts = [
    { id: 'yogurt', price: 180, icon: 'Container', store: 'life', translation: 'pickPurchase.yogurt' },
    { id: 'milk', price: 248, icon: 'Milk', store: 'life', translation: 'pickPurchase.milk' },
    { id: 'eggs', price: 343, icon: 'Egg', store: 'life', translation: 'pickPurchase.eggs' },
    { id: 'cigarette', price: 580, icon: 'Cigarette', store: 'life', translation: 'pickPurchase.cigarette' },
    { id: 'beer', price: 1280, icon: 'Beer', store: 'life', translation: 'pickPurchase.beer' },
    { id: 'rice', price: 2795, icon: 'Wheat', store: 'life', translation: 'pickPurchase.rice' },
  ];

  // Filter products based on selected store
  const displayedProducts = selectedStore 
    ? allProducts.filter(product => product.store === selectedStore)
    : allProducts;

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = { Container, Milk, Egg, Cigarette, Beer, Wheat };
    return icons[iconName];
  };

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
            <button
              onClick={() => setSelectedStore(selectedStore === 'seven-eleven' ? null : 'seven-eleven')}
              className={`rounded-lg p-2 transition-all duration-300 border-2 ${
                selectedStore === 'seven-eleven' || selectedStore === null
                  ? 'bg-primary/10 border-primary shadow-md scale-105'
                  : 'bg-card border-border opacity-50 hover:opacity-100'
              }`}
            >
              <img src={sevenElevenLogo} alt="7-Eleven" className="w-8 h-8" />
            </button>
          </div>
        </div>

        {/* Purchase Options */}
        <div className="grid grid-cols-2 gap-4">
          {displayedProducts.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-muted-foreground">{t('pickPurchase.noItems') || 'No items available from this store'}</p>
            </div>
          ) : (
            displayedProducts.map((product) => {
              const IconComponent = getIconComponent(product.icon);
              return (
                <Card 
                  key={product.id}
                  className="bg-card border-border p-6 cursor-pointer hover:bg-muted/50 transition-colors relative" 
                  onClick={() => navigate('/decide-deposit', { 
                    state: { 
                      product: product.id,
                      price: product.price,
                      icon: product.icon
                    }
                  })}
                >
                  <div className="text-center space-y-3">
                    <IconComponent className="w-8 h-8 mx-auto text-foreground" />
                    <div>
                      <p className="font-medium">{t(product.translation)}</p>
                      <p className="text-sm text-muted-foreground">￥{product.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <img src={lifeLogo} alt="Life" className="absolute bottom-2 right-2 w-8 h-8 opacity-70" />
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>;
};
export default PickPurchase;