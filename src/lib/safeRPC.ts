import { ethers } from 'ethers';
import EthersAdapter from '@safe-global/safe-ethers-lib';
import SafeServiceClient from '@safe-global/safe-service-client';

import type { ExternalProvider } from '@ethersproject/providers';

const getSafeCoreAdapter = (web3Provider: ExternalProvider) => {
  const provider = new ethers.providers.Web3Provider(web3Provider);
  const safeOwner = provider.getSigner(0);

  return new EthersAdapter({
    ethers,
    signerOrProvider: safeOwner,
  });
};

export const getSafeCoreClient = (web3Provider: ExternalProvider) => {
  const txServiceUrl = 'https://safe-transaction-mainnet.safe.global';
  const ethAdapter = getSafeCoreAdapter(web3Provider);
  return new SafeServiceClient({ txServiceUrl, ethAdapter });
};
