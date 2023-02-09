import type { SafeEventEmitterProvider } from '@web3auth/base';
export default class EthereumRpc {
    private provider;
    constructor(provider: SafeEventEmitterProvider);
    getChainId(): Promise<any>;
    getAccounts(): Promise<any>;
    getBalance(): Promise<string>;
}
