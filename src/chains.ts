import { CHAIN_NAMESPACES, CustomChainConfig } from '@web3auth/base';

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY || '';

export const chains: Record<
  string,
  Partial<CustomChainConfig> & Pick<CustomChainConfig, 'chainNamespace'>
> = {
  MAINNET: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x1',
    rpcTarget: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  },
  GOERLI: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x5',
    rpcTarget: `https://goerli.infura.io/v3/${INFURA_KEY}`,
  },
};
