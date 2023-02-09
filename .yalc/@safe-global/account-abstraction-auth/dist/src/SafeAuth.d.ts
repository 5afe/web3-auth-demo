/// <reference types="node" />
import EventEmitter from 'events';
import { SafeAuthConfig, SafeAuthProviderType, SafeAuthSignInData, SafeAuthEvents } from './types';
export default class SafeAuth extends EventEmitter {
    safeAuthData?: SafeAuthSignInData;
    private authClient?;
    private config;
    constructor(providerType: SafeAuthProviderType, config: SafeAuthConfig);
    private initializeAuthProvider;
    signIn(): Promise<SafeAuthSignInData>;
    signOut(): Promise<void>;
    getProvider(): any;
    subscribe(eventName: typeof SafeAuthEvents, listener: (...args: any[]) => void): void;
    private getSafeCoreClient;
}
