import { useState, useEffect } from 'react';

export const useExchangeRate = () => {
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=JPY');
        if (!response.ok) throw new Error('Failed to fetch exchange rate');
        
        const data = await response.json();
        setRate(data.rates.JPY);
        setError(null);
      } catch (err) {
        console.error('Error fetching exchange rate:', err);
        setError('Failed to load exchange rate');
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
    
    // Refresh every 30 minutes
    const interval = setInterval(fetchRate, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { rate, loading, error };
};
