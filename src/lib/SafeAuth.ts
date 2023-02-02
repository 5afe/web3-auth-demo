import Web3AuthProvider from './auth-providers/Web3AuthProvider';
import RPC from './ethersRPC';

interface LoginResponse {
  chainId: string;
  eoa: {
    address: string;
    balance: string;
  };
  safes: string[];
  userInfo: {
    name?: string;
    email?: string;
  };
}

type AuthProviderType = 'web3Auth';

export interface ISafeAuthClient {
  provider: any;
  getUserInfo(): Promise<{ name?: string; email?: string }>;
  initialize(): Promise<void>;
  signIn(): Promise<any>;
  signOut(): Promise<any>;
}

export default class SafeAuth {
  private authClient?: ISafeAuthClient;

  constructor(providerType: AuthProviderType, chainId: string) {
    this.initializeAuthProvider(providerType, chainId);
  }

  private async initializeAuthProvider(
    type: AuthProviderType,
    chainId: string
  ) {
    switch (type) {
      case 'web3Auth':
        this.authClient = new Web3AuthProvider(
          process.env.REACT_APP_WEB3AUTH_CLIENT_ID || '',
          chainId
        );

        return await this.authClient.initialize();
      default:
        return;
    }
  }

  async signIn(): Promise<LoginResponse> {
    await this.authClient?.signIn();

    const userInfo = await this.authClient?.getUserInfo();

    const rpc = this.getProvider() && new RPC(this.getProvider());
    const address = await rpc.getAccounts();
    const balance = await rpc.getBalance();
    const chainId = await rpc.getChainId();

    return {
      chainId,
      eoa: { address, balance },
      safes: [],
      userInfo: userInfo || {},
    };
  }

  async signOut(): Promise<void> {
    this.authClient?.signOut();
  }

  getProvider() {
    return this.authClient?.provider;
  }

  // private provider: SafeEventEmitterProvider;
  // private safeCoreClient: SafeServiceClient;
  // private safeAddress: string;
  // private safeOwnerAddress: string;
  // constructor(provider: SafeEventEmitterProvider) {
  //   this.provider = provider;
  //   this.safeCoreClient = getSafeCoreClient(provider);
  // }
  // async getSafeAddress(): Promise<string> {
  //   try {
  //     const safeAddress = await this.safeCoreClient.getSafeAddress();
  //     this.safeAddress = safeAddress;
  //     return safeAddress;
  //   } catch (error) {
  //     return error;
  //   }
  // }
  // async getSafeOwnerAddress(): Promise<string> {
  //   try {
  //     const safeOwnerAddress = await this.safeCoreClient.getSafeOwnerAddress();
  //     this.safeOwnerAddress = safeOwnerAddress;
  //     return safeOwnerAddress;
  //   } catch (error) {
  //     return error;
  //   }
  // }
  // async getSafeBalance(): Promise<string> {
  //   try {
  //     const safeBalance = await this.safeCoreClient.getSafeBalance();
  //     return safeBalance;
  //   } catch (error) {
  //     return error;
  //   }
  // }
  // async getSafeOwnerBalance(): Promise<string> {
  //   try {
  //     const safeOwnerBalance = await this.safeCoreClient.getSafeOwnerBalance();
  //     return safeOwnerBalance;
  //   } catch (error) {
  //     return error;
  //   }
  // }
  // async getSafeNonce(): Promise<string> {
  //   try {
  //     const safeNonce = await this.safeCoreClient.getSafeNonce();
  //     return safeNonce;
  //   } catch (error) {
  //     return error;
  //   }
  // }
  // async getSafeOwnerNonce(): Promise<string> {
  //   try {
  //     const safeOwnerNonce = await this.safeCoreClient.getSafeOwnerNonce();
  //     return safeOwnerNonce;
  //   } catch (error) {
  //     return error;
  //   }
  // }
  // async getSafeThreshold(): Promise<string> {
  //   try {
  //     const safeThreshold = await this.safeCoreClient.getSafeThreshold();
  //     return safeThreshold;
  //   } catch (error) {
  //     return error;
  //   }
  // }
  // async getSafeOwnerThreshold(): Promise<string> {
  //   try {
  //     const safeOwnerThreshold =
  //       await this.safeCoreClient.getSafeOwnerThreshold();
  //     return safeOwnerThreshold;
  //   } catch (error) {
  //     return error;
  //   }
  // }
}
