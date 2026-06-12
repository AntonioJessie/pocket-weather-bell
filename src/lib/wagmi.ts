import { base } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";
import { createConfig, http } from "wagmi";
import type { EIP1193Provider } from "viem";

export const baseAppId = "6a2bc51f0cfd412b2ab2c314";
export const buildCode = "bc_vm82uras";
export const erc8021DataSuffix =
  "0x62635f766d3832757261730b0080218021802180218021802180218021" as `0x${string}`;

export const contractAddress =
  "0xe3fa5dccc68a6852e85c068603f092b119b4ce9e" as `0x${string}`;

export const isContractConfigured =
  contractAddress !== "0x0000000000000000000000000000000000000000";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected({
      target: "metaMask",
    }),
    injected({
      target: {
        id: "okx",
        name: "OKX Wallet",
        provider: () =>
          typeof window !== "undefined" ? window.okxwallet : undefined,
      },
    }),
    injected({
      target: {
        id: "base-injected",
        name: "Injected Wallet",
        provider: () =>
          typeof window !== "undefined" ? window.ethereum : undefined,
      },
    }),
    coinbaseWallet({
      appName: "Pocket Weather Bell",
      preference: "all",
    }),
  ],
  transports: {
    [base.id]: http(),
  },
  dataSuffix: erc8021DataSuffix,
});

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
    okxwallet?: EIP1193Provider;
  }
}
