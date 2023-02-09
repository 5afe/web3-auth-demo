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
export default class EthereumRpc {
    constructor(provider) {
        this.provider = provider;
    }
    getChainId() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ethersProvider = new ethers.providers.Web3Provider(this.provider);
                const networkDetails = yield ethersProvider.getNetwork();
                return networkDetails.chainId;
            }
            catch (error) {
                return error;
            }
        });
    }
    getAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ethersProvider = new ethers.providers.Web3Provider(this.provider);
                const signer = ethersProvider.getSigner();
                const address = yield signer.getAddress();
                return address;
            }
            catch (error) {
                return error;
            }
        });
    }
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ethersProvider = new ethers.providers.Web3Provider(this.provider);
                const signer = ethersProvider.getSigner();
                const address = yield signer.getAddress();
                const balance = ethers.utils.formatEther(yield ethersProvider.getBalance(address));
                return balance;
            }
            catch (error) {
                return error;
            }
        });
    }
}
//# sourceMappingURL=EthereumRPC.js.map