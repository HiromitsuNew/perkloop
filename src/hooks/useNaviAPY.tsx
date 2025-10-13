import { useState, useEffect } from 'react';

interface NaviPool {
  symbol: string;
  supplyApy: number;
}

export const useNaviAPY = () => {
  const [usdcAPY, setUsdcAPY] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAPY = async () => {
      try {
        const response = await fetch('https://open-api.naviprotocol.io/api/navi/pools');
        if (!response.ok) throw new Error('Failed to fetch APY data');
        
        const data: NaviPool[] = await response.json();
        const usdcPool = data.find(pool => pool.symbol === 'USDC');
        
        if (usdcPool) {
          setUsdcAPY(usdcPool.supplyApy);
          setError(null);
        } else {
          setError('USDC pool not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAPY();
    const interval = setInterval(fetchAPY, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  // Calculate user APY: NAVI APY - (1% + 20% of remaining returns)
  const calculateUserAPY = (naviAPY: number): number => {
    const managementFee = 1 + (naviAPY - 1) * 0.20;
    return Math.max(0, naviAPY - managementFee);
  };

  return {
    naviAPY: usdcAPY,
    userAPY: usdcAPY ? calculateUserAPY(usdcAPY) : null,
    managementFee: usdcAPY ? 1 + (usdcAPY - 1) * 0.20 : null,
    isLoading,
    error,
  };
};
