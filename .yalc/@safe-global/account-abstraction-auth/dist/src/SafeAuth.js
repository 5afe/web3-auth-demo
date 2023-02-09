var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ethers } from 'ethers';
import EventEmitter from 'events';
import EthersAdapter from '@safe-global/safe-ethers-lib';
import SafeServiceClient from '@safe-global/safe-service-client';
import Web3AuthProvider from './auth-providers/Web3AuthProvider';
import RPC from './EthereumRPC';
import { SafeAuthProviderType, SafeAuthEvents } from './types';
export default class SafeAuth extends EventEmitter {
    constructor(providerType, config) {
        super();
        this.config = config;
        this.initializeAuthProvider(providerType);
    }
    initializeAuthProvider(type) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (type) {
                case SafeAuthProviderType.Web3Auth:
                    this.authClient = new Web3AuthProvider(this.config.chainId, this.config.authProviderConfig);
                    return yield this.authClient.initialize();
                default:
                    return;
            }
        });
    }
    signIn() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.authClient) === null || _a === void 0 ? void 0 : _a.signIn());
            const userInfo = yield ((_b = this.authClient) === null || _b === void 0 ? void 0 : _b.getUserInfo());
            const rpc = new RPC(this.getProvider());
            const address = yield rpc.getAccounts();
            const balance = yield rpc.getBalance();
            const chainId = yield rpc.getChainId();
            const { safes } = yield this.getSafeCoreClient().getSafesByOwner(address);
            this.emit(SafeAuthEvents.SIGN_IN);
            this.safeAuthData = {
                chainId,
                eoa: { address, balance },
                safes,
                userInfo: userInfo || {}
            };
            return this.safeAuthData;
        });
    }
    signOut() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.authClient) === null || _a === void 0 ? void 0 : _a.signOut());
            this.safeAuthData = undefined;
            this.emit(SafeAuthEvents.SIGN_OUT);
        });
    }
    getProvider() {
        var _a;
        return (_a = this.authClient) === null || _a === void 0 ? void 0 : _a.provider;
    }
    subscribe(eventName, listener) {
        this.on(eventName.toString(), listener);
    }
    getSafeCoreClient() {
        const provider = new ethers.providers.Web3Provider(this.getProvider());
        const safeOwner = provider.getSigner(0);
        const adapter = new EthersAdapter({
            ethers,
            signerOrProvider: safeOwner
        });
        return new SafeServiceClient({
            txServiceUrl: this.config.txServiceUrl,
            ethAdapter: adapter
        });
    }
}
//# sourceMappingURL=SafeAuth.js.map