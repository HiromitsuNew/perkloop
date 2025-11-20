import { useState, useEffect } from 'react';

interface NaviPool {
  token: {
    symbol: string;
  };
  supplyIncentiveApyInfo: {
    apy: string;
  };
}

interface NaviApiResponse {
  data: NaviPool[];
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
        
        const apiResponse: NaviApiResponse = await response.json();
        const usdcPool = apiResponse.data.find(pool => pool.token.symbol === 'USDC');
        
        if (usdcPool) {
          const apyValue = parseFloat(usdcPool.supplyIncentiveApyInfo.apy);
          setUsdcAPY(apyValue);
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

  // Calculate user APY: NAVI APY - 5% flat fee
  const calculateUserAPY = (naviAPY: number): number => {
    const managementFee = naviAPY * 0.05;
    return Math.max(0, naviAPY - managementFee);
  };

  return {
    naviAPY: usdcAPY,
    userAPY: usdcAPY ? calculateUserAPY(usdcAPY) : null,
    managementFee: usdcAPY ? usdcAPY * 0.05 : null,
    isLoading,
    error,
  };
};
