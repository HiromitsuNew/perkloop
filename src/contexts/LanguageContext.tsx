import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Dashboard
    'dashboard.title1': 'Select a desirable good to',
    'dashboard.title2': 'let your',
    'dashboard.title2.money': 'money',
    'dashboard.title2.rest': 'work for you',
    'dashboard.withdrawable': 'Withdrawable Principle',
    'dashboard.investment': 'Investment Progress',
    'dashboard.days': 'Days',
    'dashboard.until': 'Until the next free',
    'dashboard.starbucks': 'Starbucks',
    'dashboard.withdraw': 'Withdraw Principle',
    'dashboard.addPurchases': 'Add new purchases',
    'dashboard.privacy': 'Privacy Policy',
    'dashboard.userAgreement': 'User Agreement',
    
    // Pick Purchase
    'pickPurchase.title1': 'Select a desirable good to',
    'pickPurchase.title2': 'let your',
    'pickPurchase.title2.money': 'money',
    'pickPurchase.title2.rest': 'work for you',
    'pickPurchase.pick': 'Pick a purchase',
    'pickPurchase.starbucks': 'Starbucks',
    'pickPurchase.netflix': 'Netflix',
    
    // Decide Deposit
    'decideDeposit.title1': 'Select a desirable good to',
    'decideDeposit.title2': 'let your',
    'decideDeposit.title2.money': 'money',
    'decideDeposit.title2.rest': 'work for you',
    'decideDeposit.decide': 'Decide your deposit',
    'decideDeposit.selected': 'Selected Item',
    'decideDeposit.netflix': 'Netflix',
    'decideDeposit.deposit': 'Deposit',
    'decideDeposit.payback': 'Pay back in',
    'decideDeposit.aiRec': 'AI Recommendation',
    'decideDeposit.aiRecText': 'Depositing USD 3968.8 today to get a free Netflix in one month.',
    'decideDeposit.nextStep': 'Next step',
    'decideDeposit.addMore': 'Add more recurring purchases',
    
    // Payment Method
    'paymentMethod.title1': 'Select a desirable good to',
    'paymentMethod.title2': 'let your',
    'paymentMethod.title2.money': 'money',
    'paymentMethod.title2.rest': 'work for you',
    'paymentMethod.selectPayment': 'Select payment method',
    'paymentMethod.selected': 'Selected Item',
    'paymentMethod.netflix': 'Netflix',
    'paymentMethod.deposit': 'Deposit',
    'paymentMethod.payback': 'Pay back in',
    'paymentMethod.summary': 'Summary of your offer',
    'paymentMethod.summaryText': 'By depositing the above amount, you\'ll get Netflix every month for the above duration for free.',
    'paymentMethod.paymentTitle': 'How do you want to deposit?',
    'paymentMethod.bankWire': 'Bank wire',
    'paymentMethod.stablecoin': 'Stablecoin',
    'paymentMethod.creditCard': 'Credit Card'
  },
  ja: {
    // Dashboard
    'dashboard.title1': '理想的な商品を選んで',
    'dashboard.title2': 'あなたの',
    'dashboard.title2.money': 'お金',
    'dashboard.title2.rest': 'を働かせましょう',
    'dashboard.withdrawable': '引き出し可能元本',
    'dashboard.investment': '投資進捗',
    'dashboard.days': '日',
    'dashboard.until': '次の無料',
    'dashboard.starbucks': 'スターバックス',
    'dashboard.withdraw': '元本を引き出す',
    'dashboard.addPurchases': '新しい購入を追加',
    'dashboard.privacy': 'プライバシーポリシー',
    'dashboard.userAgreement': '利用規約',
    
    // Pick Purchase
    'pickPurchase.title1': '理想的な商品を選んで',
    'pickPurchase.title2': 'あなたの',
    'pickPurchase.title2.money': 'お金',
    'pickPurchase.title2.rest': 'を働かせましょう',
    'pickPurchase.pick': '購入を選択',
    'pickPurchase.starbucks': 'スターバックス',
    'pickPurchase.netflix': 'ネットフリックス',
    
    // Decide Deposit
    'decideDeposit.title1': '理想的な商品を選んで',
    'decideDeposit.title2': 'あなたの',
    'decideDeposit.title2.money': 'お金',
    'decideDeposit.title2.rest': 'を働かせましょう',
    'decideDeposit.decide': '預金額を決める',
    'decideDeposit.selected': '選択されたアイテム',
    'decideDeposit.netflix': 'ネットフリックス',
    'decideDeposit.deposit': '預金',
    'decideDeposit.payback': '返済期間',
    'decideDeposit.aiRec': 'AI推奨',
    'decideDeposit.aiRecText': '今日USD 3968.8を預けて、1ヶ月で無料のNetflixを手に入れましょう。',
    'decideDeposit.nextStep': '次のステップ',
    'decideDeposit.addMore': '定期購入を追加',
    
    // Payment Method
    'paymentMethod.title1': '理想的な商品を選んで',
    'paymentMethod.title2': 'あなたの',
    'paymentMethod.title2.money': 'お金',
    'paymentMethod.title2.rest': 'を働かせましょう',
    'paymentMethod.selectPayment': '決済方法を選択',
    'paymentMethod.selected': '選択されたアイテム',
    'paymentMethod.netflix': 'ネットフリックス',
    'paymentMethod.deposit': '預金',
    'paymentMethod.payback': '返済期間',
    'paymentMethod.summary': 'オファーの概要',
    'paymentMethod.summaryText': '上記金額を預けることで、上記期間中毎月無料でNetflixをご利用いただけます。',
    'paymentMethod.paymentTitle': 'どのように預金しますか？',
    'paymentMethod.bankWire': '銀行振込',
    'paymentMethod.stablecoin': 'ステーブルコイン',
    'paymentMethod.creditCard': 'クレジットカード'
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};