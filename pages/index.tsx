import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia, polygonAmoy, arbitrumSepolia } from "wagmi/chains";

import DefaultLayout from "@/layouts/default";

import "@rainbow-me/rainbowkit/styles.css";
import { Swap } from "@/components/swap";

const queryClient = new QueryClient();
const projectId = "04ff56d4de7460cb3af57743d11701db"; // dashboard
const appName = "Parasail";
const config = getDefaultConfig({
  appName,
  projectId,
  chains: [arbitrumSepolia, {
    id: 52164803,
    name: 'tFluence',
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
  }],
  wallets: [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, coinbaseWallet],
    },
    {
      groupName: "Hardware Wallets",
      wallets: [ledgerWallet],
    },
  ],
  ssr: true,
});

export default function IndexPage() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <DefaultLayout>
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
              <Swap />
            </section>
          </DefaultLayout>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
