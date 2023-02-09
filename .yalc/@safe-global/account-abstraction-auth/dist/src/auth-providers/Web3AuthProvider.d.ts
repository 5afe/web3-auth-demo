import type { SafeAuthClient, Web3AuthProviderConfig } from '../types';
export default class Web3AuthProvider implements SafeAuthClient {
    provider: any;
    private chainId;
    private web3authInstance?;
    private config;
    constructor(chainId: string, config: Web3AuthProviderConfig);
    initialize(): Promise<void>;
    signIn(): Promise<void>;
    signOut(): Promise<void>;
    getUserInfo(): Promise<{
        name?: string;
        email?: string;
    }>;
}
