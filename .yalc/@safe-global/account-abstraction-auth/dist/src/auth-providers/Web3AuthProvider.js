var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CHAIN_NAMESPACES } from '@web3auth/base';
import { Web3Auth } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
export default class Web3AuthProvider {
    constructor(chainId, config) {
        this.config = config;
        this.chainId = chainId;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const web3auth = new Web3Auth({
                    clientId: this.config.web3AuthClientId,
                    web3AuthNetwork: this.config.web3AuthNetwork,
                    chainConfig: {
                        chainNamespace: CHAIN_NAMESPACES.EIP155,
                        chainId: this.chainId,
                        rpcTarget: this.config.rpcTarget
                    },
                    uiConfig: {
                        theme: this.config.theme,
                        loginMethodsOrder: ['facebook', 'google']
                    }
                });
                const openloginAdapter = new OpenloginAdapter({
                    loginSettings: {
                        mfaLevel: 'none'
                    },
                    adapterSettings: {
                        uxMode: 'popup',
                        whiteLabel: {
                            name: 'Safe',
                            defaultLanguage: 'en'
                        }
                    }
                });
                web3auth.configureAdapter(openloginAdapter);
                yield web3auth.initModal();
                this.provider = web3auth.provider;
                this.web3authInstance = web3auth;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    signIn() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.web3authInstance)
                return;
            this.provider = yield this.web3authInstance.connect();
        });
    }
    signOut() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.web3authInstance)
                return;
            return yield ((_a = this.web3authInstance) === null || _a === void 0 ? void 0 : _a.logout());
        });
    }
    getUserInfo() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.web3authInstance)
                return {};
            const userInfo = yield ((_a = this.web3authInstance) === null || _a === void 0 ? void 0 : _a.getUserInfo());
            return { name: userInfo.name, email: userInfo.email };
        });
    }
}
//# sourceMappingURL=Web3AuthProvider.js.map