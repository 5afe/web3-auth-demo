import Web3AuthProvider from './auth-providers/Web3AuthProvider';
import RPC from './EthereumRPC';
import { ethers } from 'ethers';
import EthersAdapter from '@safe-global/safe-ethers-lib';
import SafeServiceClient from '@safe-global/safe-service-client';
import {
  SafeAuthClient,
  SafeAuthConfig,
  SafeAuthProviderType,
  SafeAuthSignInResponse,
} from './types';

export default class SafeAuth {
  private authClient?: SafeAuthClient;
  private txServiceUrl: string;

  constructor(
    providerType: SafeAuthProviderType,
    { chainId, txServiceUrl }: SafeAuthConfig
  ) {
    this.txServiceUrl = txServiceUrl;
    this.initializeAuthProvider(providerType, chainId);
  }

  private async initializeAuthProvider(
    type: SafeAuthProviderType,
    chainId: string
  ) {
    switch (type) {
      case SafeAuthProviderType.Web3Auth:
        this.authClient = new Web3AuthProvider(
          process.env.REACT_APP_WEB3AUTH_CLIENT_ID || '',
          chainId
        );

        return await this.authClient.initialize();
      default:
        return;
    }
  }

  async signIn(): Promise<SafeAuthSignInResponse> {
    await this.authClient?.signIn();

    const userInfo = await this.authClient?.getUserInfo();

    const rpc = new RPC(this.getProvider());
    const address = await rpc.getAccounts();
    const balance = await rpc.getBalance();
    const chainId = await rpc.getChainId();

    const { safes } = await this.getSafeCoreClient().getSafesByOwner(address);

    return {
      chainId,
      eoa: { address, balance },
      safes,
      userInfo: userInfo || {},
    };
  }

  async signOut(): Promise<void> {
    this.authClient?.signOut();
  }

  getProvider() {
    return this.authClient?.provider;
  }

  private getSafeCoreClient() {
    const provider = new ethers.providers.Web3Provider(this.getProvider());
    const safeOwner = provider.getSigner(0);

    const adapter = new EthersAdapter({
      ethers,
      signerOrProvider: safeOwner,
    });

    return new SafeServiceClient({
      txServiceUrl: this.txServiceUrl,
      ethAdapter: adapter,
    });
  }
}
