import { useState, useEffect } from 'react';
import { useUwuProviderContext } from '../uwu-provider/UwuProvider';

const useGetEnsName = (address: string) => {
  const { provider: uwuProvider } = useUwuProviderContext();
  const [ensName, setEnsName] = useState<string | null>(null);

  const getRecord = async (address: string) => {
    try {
      const name = await uwuProvider.lookupAddress(address);
      setEnsName(name);
    } catch (error) {
      console.error('ENS lookup error', error);
    }
  };

  useEffect(() => {
    if (address) {
      getRecord(address);
    } else {
      setEnsName(null);
    }
  }, [address]);

  return { ensName };
};

export default useGetEnsName;
