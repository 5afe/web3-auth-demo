type EOA = {
  address: string;
  balance: string;
};

type UserInfo = {
  name?: string;
  email?: string;
};

export interface SafeAuthSignInResponse {
  chainId: string;
  eoa: EOA;
  safes: string[];
  userInfo: UserInfo;
}

export interface SafeAuthClient {
  provider: any;
  getUserInfo(): Promise<UserInfo>;
  initialize(): Promise<void>;
  signIn(): Promise<any>;
  signOut(): Promise<any>;
}

export enum SafeAuthProviderType {
  Web3Auth,
}

export interface SafeAuthConfig {
  chainId: string;
  txServiceUrl: string;
}
