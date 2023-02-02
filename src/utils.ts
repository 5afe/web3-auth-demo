import { ethers } from 'ethers';

import type { SafeEventEmitterProvider } from '@web3auth/base';

export class RPC {
  private provider: SafeEventEmitterProvider;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }

  async sendTransaction(target: string): Promise<any> {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const signer = ethersProvider.getSigner();

      const amount = ethers.utils.parseEther('0.001');

      const tx = await signer.sendTransaction({
        to: target,
        value: amount,
        maxPriorityFeePerGas: '5000000000', // Max priority fee per gas
        maxFeePerGas: '6000000000000', // Max fee per gas
      });

      const receipt = await tx.wait();

      return receipt;
    } catch (error) {
      return error as string;
    }
  }

  async signMessage(message: string) {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const signer = ethersProvider.getSigner();

      // Sign the message
      const signedMessage = await signer.signMessage(message);

      return signedMessage;
    } catch (error) {
      return error as string;
    }
  }

  async getPrivateKey(): Promise<any> {
    try {
      const privateKey = await this.provider.request({
        method: 'eth_private_key',
      });

      return privateKey;
    } catch (error) {
      return error as string;
    }
  }
}
