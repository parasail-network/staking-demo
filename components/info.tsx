import { Button } from '@nextui-org/button'
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Select,
  SelectItem,
  Spinner,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from '@nextui-org/react'
import { Listbox, ListboxItem } from '@nextui-org/react'
import { TokenIcon, NetworkIcon } from '@web3icons/react'
import { FaArrowDown } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { chainAddresses, chainConfig } from '@/config/chains'
import { useAccount, useChainId, useWriteContract } from 'wagmi'
import { useEthersSigner } from '@/utils/useProvider'
import { agentPool, DelegationPool, ERC20, DepinERC20 } from '@/utils/demo'
import { useInterval, useSetState } from 'ahooks'
import { ethers } from 'ethers'
const { formatEther, parseEther } = ethers.utils
// create a wait function
const wait = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const Info = () => {
  const { address } = useAccount()
  const [chain, setChain] = useState(chainConfig[0].chainId)
  const [state, setState] = useSetState({
    ETHBalance: '0',
    USDTBalance: '0',
    eFLTBalance: '0',
    epFLTBalance: '0',

    FLTBalance: '0',
    pFLTBalance: '0',
  })
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const chainId = useChainId()
  const signer = useEthersSigner()

  useEffect(() => {
    init()
  }, [address])

  useInterval(() => {
    console.log('update balance')
    init()
  }, 5000)

  const init = async () => {
    if (!address) return
    const [
      // ETHBalance,
      USDTBalance,
      eFLTBalance,
      epFLTBalance,
      FLTBalance,
      pFLTBalance,
    ] = await Promise.all([
      // agentPool.getContract().provider.getBalance(address!),
      new ERC20(chainAddresses.USDT).balanceOf(address!),
      new ERC20(chainAddresses.eFLT).balanceOf(address!),
      new ERC20(chainAddresses.epFLT).balanceOf(address!),
      new DepinERC20(chainAddresses.FLT).balanceOf(address!),
      new DepinERC20(chainAddresses.pFLT).balanceOf(address!),
    ])

    setState({
      // ETHBalance: Number(formatEther(ETHBalance)).toFixed(5),
      USDTBalance: Number(USDTBalance).toFixed(5),
      eFLTBalance: Number(eFLTBalance).toFixed(5),
      epFLTBalance: Number(epFLTBalance).toFixed(5),
      FLTBalance: Number(FLTBalance).toFixed(5),
      pFLTBalance: Number(pFLTBalance).toFixed(5),
    })
  }

  return (
    <div className='fixed left-0 bottom-0 w-80'>
      <Listbox
        aria-label='User Menu'
        className='p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 max-w-[300px] overflow-visible shadow-small rounded-medium'
        itemClasses={{
          base: 'px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-8 data-[hover=true]:bg-default-100/80',
        }}
      >
        {/* <ListboxItem key='eth' endContent={state.ETHBalance}>
          ETHBalance
        </ListboxItem> */}
        <ListboxItem key='usdt' endContent={state.USDTBalance}>
          USDTBalance
        </ListboxItem>
        <ListboxItem key='eflt' endContent={state.eFLTBalance}>
          eFLTBalance
        </ListboxItem>
        <ListboxItem key='epflt' endContent={state.epFLTBalance}>
          epFLTBalance
        </ListboxItem>
        <ListboxItem key='flt' endContent={state.FLTBalance}>
          FLTBalance
        </ListboxItem>
        <ListboxItem key='pflt' endContent={state.pFLTBalance}>
          pFLTBalance
        </ListboxItem>
      </Listbox>
    </div>
  )
}
