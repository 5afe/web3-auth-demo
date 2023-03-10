type EOA = {
    address: string;
    balance: string;
};
type UserInfo = {
    name?: string;
    email?: string;
};
export interface SafeAuthSignInData {
    chainId: string;
    eoa: EOA;
    safes: string[];
    userInfo: UserInfo;
}
export interface SafeAuthClient {
    provider: any;
    getUserInfo(): Promise<UserInfo>;
    initialize(): Promise<void>;
    signIn(): Promise<void>;
    signOut(): Promise<void>;
}
export declare enum SafeAuthProviderType {
    Web3Auth = 0
}
export interface Web3AuthProviderConfig {
    rpcTarget: string;
    web3AuthClientId: string;
    web3AuthNetwork: 'mainnet' | 'aqua' | 'celeste' | 'cyan' | 'testnet';
    theme: 'light' | 'dark' | 'auto';
    appLogo?: string;
}
export interface SafeAuthConfig {
    chainId: string;
    txServiceUrl: string;
    authProviderConfig: Web3AuthProviderConfig;
}
export declare const SafeAuthEvents: {
    SIGN_IN: string;
    SIGN_OUT: string;
};
export {};
