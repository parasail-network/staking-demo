import { arbitrumSepolia, polygonAmoy } from "viem/chains"

export const tFluenceNetwork = {
  id: 52164803,
  name: 'Fluence Testnet',
  nativeCurrency: {
    name: 'Fluence Testnet coin',
    symbol: 'tFLT',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.fluence.dev'] },
  },
  blockExplorers: {
    default: {
      name: 'Testnet Fluence',
      url: 'https://blockscout.testnet.fluence.dev',
    },
  },
}

export const chainAddresses = {
  Pool: '0xcbe7efd39be37699e2377ddab28b627aa321d209',
  ETH: '0x0000000000000000000000000000000000000000',
  USDT: '0xc31f699a446A3eC59d8D1A82715997816348Cd30',
  eFLT: '0xdc8402dfd7285b264f19af76ef983655b664c509',
  epFLT: '0x42b56281f36D66c08415EF5344F03e363a8015Ef',
  // Depin chain
  FLT: '0x184b5af5ed92b3df063fec91dcee5b50501bcd99',
  pFLT: '0xA64f3C84e3d44971a3619310E605142db7Cd063E',
  agent: '0x304ecea262847f902be52c2ca9e621dd54d181ff',
  delegationPool: '0xd9694e94857fcd8c88396d79ab8dd719e459f7e7',
}

export const chainConfig = [
  {
    chain: 'Arbitrum',
    label: 'Arbitrum',
    chainId: arbitrumSepolia.id,
    icon: 'arbitrum',
    // contracts: {
    //   proxy: '0xee9c1c98bc1785a833f493f6484c2a8e003c979f',
    // },
    fromTokens: [
      {
        label: 'ETH',
        address: chainAddresses.ETH,
        decimals: 18,
        symbol: 'ETH',
        icon: 'eth',
      },
      {
        label: 'USDT',
        address: chainAddresses.USDT,
        decimals: 6,
        symbol: 'USDT',
        icon: 'usdt',
      },
      {
        label: 'eFLT',
        address: chainAddresses.eFLT,
        decimals: 18,
        symbol: 'eFLT',
        icon: 'usdc',
      },
    ],
    toTokens: [
      {
        label: 'epFLT',
        address: chainAddresses.epFLT,
        decimals: 18,
        symbol: 'epFLT',
        icon: 'xlm',
      },
      {
        label: 'epATH',
        address: chainAddresses.epFLT,
        decimals: 18,
        symbol: 'pATH',
        icon: 'apt',
        disabled: true
      },
    ]
  },
  {
    chain: 'tFluence',
    label: 'tFluence',
    chainId: tFluenceNetwork.id,
    icon: 'polygon',
    contracts: {
      proxy: '',
    },
    fromTokens: [
      {
        label: 'FLT',
        address: chainAddresses.FLT,
        decimals: 18,
        symbol: 'FLT',
        icon: 'usdc',
      },
    ],
    toTokens: [
      {
        label: 'pFLT',
        address: chainAddresses.pFLT,
        decimals: 18,
        symbol: 'pFLT',
        icon: 'xlm',
      },
    ]
  },
]
