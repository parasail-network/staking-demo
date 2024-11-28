import { Signer, utils, Contract, providers } from 'ethers'
import { AgentPoolABI, ERC20ABI, BridgeAgentABI } from './abis'
import { sepolia, arbitrumSepolia, polygonAmoy } from 'wagmi/chains'
import { formatEther, parseEther } from 'viem'
import { chainAddresses, tFluenceNetwork } from '@/config/chains'

export class AgentPool {
  contract: Contract
  constructor() {
    this.contract = new Contract(
      chainAddresses.Pool,
      AgentPoolABI,
      new providers.JsonRpcProvider(arbitrumSepolia.rpcUrls.default.http[0])
    )
  }

  connect(signer: Signer) {
    this.contract = this.contract.connect(signer)
  }

  async deposit(amount: number, recepient: string) {
    console.log('depositing', amount, recepient)
    const tx = await this.contract.deposit(
      parseEther(amount.toString()),
      recepient
    )
    await tx.wait()
  }
  async withdraw(amount: number, recepient: string) {
    console.log('withdrawing', amount, recepient)
    const tx = await this.contract.withdraw(
      parseEther(amount.toString()),
      recepient
    )
    await tx.wait()
  }
  async swapAndDeposit(
    tokenAddr: string,
    tokenAmount: number,
    recepient: string
  ) {
    console.log('depositing', tokenAmount, recepient)
    const tx = await this.contract.swapAndDeposit(
      tokenAddr,
      parseEther(tokenAmount.toString()),
      parseEther('0'),
      recepient
    )
    await tx.wait()
  }

  address() {
    return this.contract.address
  }

  getContract() {
    return this.contract
  }
}

export class ERC20 {
  contract: Contract
  constructor(address: string) {
    this.contract = new Contract(
      address,
      ERC20ABI,
      new providers.JsonRpcProvider(arbitrumSepolia.rpcUrls.default.http[0])
    )
  }
  connect(signer: Signer) {
    this.contract = this.contract.connect(signer)
  }
  async balanceOf(address: string) {
    try {
      const balance = await this.contract.balanceOf(address)
      return formatEther(balance)
    } catch (e) {
      console.log('error address', this.contract.address, address, e)
      return '0'
    }
  }
  // allowance
  async allowance(owner: string, spender: string) {
    const allowance = await this.contract.allowance(owner, spender)
    return formatEther(allowance)
  }
  //  approve
  async approve(address: string, amount: number) {
    console.log('approving', address, amount, this.contract.signer.getAddress())
    const allowance = await this.contract.allowance(
      this.contract.signer.getAddress(),
      address
    )
    if (allowance >= amount) return
    const tx = await this.contract.approve(
      address,
      parseEther(amount.toString())
    )
    await tx.wait()
  }
}

export class DelegationPool {
  contract: Contract
  constructor() {
    this.contract = new Contract(
      chainAddresses.delegationPool,
      BridgeAgentABI,
      new providers.JsonRpcProvider(tFluenceNetwork.rpcUrls.default.http[0])
    )
  }

  connect(signer: Signer) {
    this.contract = this.contract.connect(signer)
  }

  async deposit(amount: number, recepient: string) {
    const tx = await this.contract.deposit(parseEther(amount.toString()), recepient)
    await tx.wait()
  }
  async withdraw(amount: number, recepient: string) {
    const tx = await this.contract.withdraw(parseEther(amount.toString()), recepient)
    await tx.wait()
  }
}

export class DepinERC20 extends ERC20 {
  constructor(address: string) {
    super(address)
    this.contract = new Contract(
      address,
      ERC20ABI,
      new providers.JsonRpcProvider(tFluenceNetwork.rpcUrls.default.http[0])
    )
  }
}

export const agentPool = new AgentPool()
