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
import Image from 'next/image'
import { TokenIcon, NetworkIcon } from '@web3icons/react'
import { FaArrowDown } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { chainConfig, tFluenceNetwork } from '@/config/chains'
import { useAccount, useChainId, useWriteContract } from 'wagmi'
import { useEthersSigner } from '@/utils/useProvider'
import { agentPool, DelegationPool, ERC20 } from '@/utils/demo'
import { Info } from './info'
import { ethers } from 'ethers'

// create a wait function
const wait = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const Swap = () => {
  const { address } = useAccount()
  const [chain, setChain] = useState(chainConfig[0].chainId)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [reverse, setReverse] = useState(false)
  const [amount, setAmount] = useState('')
  const [receive, setReceive] = useState(0)
  const [loading, setLoading] = useState(false)
  const chainId = useChainId()
  const signer = useEthersSigner()

  useEffect(() => {
    if (
      chainId === chainConfig[0].chainId ||
      chainId === chainConfig[1].chainId
    ) {
      setChain(chainId)
    }
  }, [chainId])
  const init = async () => {}
  const chains = chainConfig.map((chain) => {
    return {
      chainId: chain.chainId,
      label: chain.label,
      icon: chain.icon,
    }
  })

  const selectedChain = chainConfig.find((c) => c.chainId === Number(chain))
  console.log('selected chains', selectedChain)
  const fromTokens =
    (reverse ? selectedChain?.toTokens : selectedChain?.fromTokens) || []
  const toTokens =
    (reverse ? selectedChain?.fromTokens : selectedChain?.toTokens) || []
  const selectedFrom = fromTokens.find((item) => item.symbol === from)
  const selectedTo = toTokens.find((item) => item.symbol === to)

  useEffect(() => {
    console.log('chain changed', chain)
    setFrom(fromTokens[0].symbol)
    setTo(toTokens[0].symbol)
  }, [selectedChain])
  const withdraw = async () => {
    try {
      setLoading(true) 
      if(chainId === tFluenceNetwork.id) {
        const agent = new DelegationPool()
        agent.connect(signer!)
        await agent.withdraw(Number(amount), address!)
      } else {
        agentPool.connect(signer!)
        await agentPool.withdraw(Number(amount), address!)
      }
    } finally {
      setLoading(false)
    }
  }
  const swap = async () => {
    if (chain !== chainId) {
      //
    }
    if(reverse) {
      return withdraw()
    }
    const tokenAddr = fromTokens.find(
      (token) => token.symbol === from
    )?.address!
    if (!tokenAddr) {
      return
    }
    console.log('from token', tokenAddr)
    setLoading(true)
    const proxyPool = agentPool
    try {
      const erc20 = new ERC20(tokenAddr)
      const agent = new DelegationPool()
      await erc20.connect(signer!)
      if (tokenAddr !== '0x0000000000000000000000000000000000000000') {
        await erc20.approve(
          chainId === tFluenceNetwork.id
            ? agent.contract.address
            : proxyPool.address(),
          Number(amount)
        )
      }
      proxyPool.connect(signer!)
      if (from === 'eFLT') {
        await proxyPool.deposit(Number(amount), address!)
      } else if (from === 'ETH') {
        await proxyPool.contract.swapAndDeposit(
          tokenAddr,
          ethers.utils.parseEther(amount),
          ethers.utils.parseEther('0.01'),
          address!,
          {
            value: ethers.utils.parseEther(amount),
          }
        )
      } else if (chainId === tFluenceNetwork.id) {
        agent.connect(signer!)
        await agent.deposit(Number(amount), address!)
      } else {
        console.log('start swap deposit', amount, address!)
        await proxyPool.swapAndDeposit(tokenAddr, Number(amount), address!)
      }
    } finally {
      setLoading(false)
    }
  }

  const RenderSelect = ({
    list,
    onSelect,
    value,
    label,
  }: {
    list: {
      label: string
      symbol: string
      icon: string
    }[]
    onSelect: (item: any) => void
    value?: any
    label?: string
  }) => {
    const item = list.find((item) => item.symbol === value)
    return (
      <div>
        <Dropdown placement='bottom-end' className='w-48'>
          <DropdownTrigger>
            <Avatar
              icon={
                <TokenIcon size={36} symbol={item?.icon!} variant='branded' />
              }
            ></Avatar>
          </DropdownTrigger>
          <DropdownMenu
            aria-label='Profile Actions'
            variant='flat'
            selectedKeys={value}
          >
            {list.map((item) => {
              return (
                <DropdownItem
                  key={item.symbol}
                  className='h-14 gap-2'
                  isDisabled={(item as any).disabled}
                  onClick={() => {
                    onSelect(item.symbol)
                    setAmount('0')
                    setReceive(0)
                  }}
                >
                  <div className='flex items-center'>
                    <TokenIcon size={36} symbol={item.icon} variant='branded' />
                    <span>{item.label}</span>
                  </div>
                </DropdownItem>
              )
            })}
          </DropdownMenu>
        </Dropdown>
      </div>
    )
  }
  return (
    <div style={{ width: 420 }}>
      <Card className='py-4' fullWidth>
        <CardHeader className='pb-0 pt-2 px-4 items-start mb-4 justify-between'>
          <h4 className='font-bold text-2xl'>Depin Stake</h4>
          <Dropdown
            placement='bottom-end'
            className='w-48'
            onChange={(e) => {
              console.log('change', e)
            }}
          >
            <DropdownTrigger>
              <div className='min-w-14 flex items-center'>
                {selectedChain?.label}
                <NetworkIcon
                  size={36}
                  network={selectedChain?.icon!}
                  variant='branded'
                />
              </div>
            </DropdownTrigger>
            <DropdownMenu
              aria-label='Profile Actions'
              variant='flat'
              selectedKeys={[chain]}
            >
              {chains.map((item) => {
                return (
                  <DropdownItem
                    key={item.chainId}
                    className='h-14 gap-2'
                    onClick={() => setChain(item.chainId)}
                  >
                    <div className='flex items-center'>
                      <NetworkIcon
                        size={36}
                        network={item.icon}
                        variant='branded'
                      />
                      <span>{item.label}</span>
                    </div>
                  </DropdownItem>
                )
              })}
            </DropdownMenu>
          </Dropdown>
        </CardHeader>
        <Divider />
        <CardBody className='overflow-visible py-4 px-4'>
          {/* <div className='text-xs flex justify-end items-center'>
            Current balance: {receive} {selectedFrom?.symbol}
          </div> */}
          <div className='flex items-center justify-between mt-6'>
            <Input
              size='lg'
              className='text-2xl'
              label='You Pay'
              placeholder='0'
              variant='underlined'
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                if(reverse) {
                  return setReceive(Number(e.target.value) * 1)
                }
                if (selectedFrom?.symbol === 'ETH') {
                  setReceive(Number(e.target.value) * 11373)
                } else if (selectedFrom?.symbol === 'USDT') {
                  setReceive(Number((Number(e.target.value) * 3).toFixed(2)))
                } else if (selectedFrom?.symbol === 'eFLT') {
                  setReceive(Number(e.target.value) * 1)
                } else if (selectedFrom?.symbol === 'FLT') {
                  setReceive(Number(e.target.value) * 1)
                }
              }}
            />
            <RenderSelect
              label='Spend'
              list={fromTokens!}
              value={from}
              onSelect={(k) => {
                setFrom(k)
              }}
            />
          </div>

          <div className='flex justify-center items-center h-12'>
            <FaArrowDown
              size={32}
              color='gray'
              onClick={() => {
                const _from = from
                const _to = to
                setFrom(_to)
                setTo(_from)
                setReverse(!reverse)
              }}
            />
          </div>
          <div className='flex items-center justify-between mt-6'>
            <Input
              size='lg'
              disabled
              className='text-2xl'
              label='You Receive'
              value={receive.toString()}
              placeholder='0'
              variant='underlined'
            />
            <RenderSelect
              label='Spend'
              list={toTokens!}
              value={to}
              onSelect={(k) => {
                setTo(k)
              }}
            />
          </div>
          <Button
            onClick={swap}
            className='h-12 mt-20'
            fullWidth
            size='lg'
            color='primary'
          >
            {reverse ? 'Withdraw' : 'Deposit'}
          </Button>
        </CardBody>
      </Card>
      {loading && (
        <div className='fixed z-50 left-0 top-0 bottom-0 right-0 flex items-center justify-center bg-black bg-opacity-85'>
          <Spinner />
        </div>
      )}
      <div>
        <Info />
      </div>
    </div>
  )
}
