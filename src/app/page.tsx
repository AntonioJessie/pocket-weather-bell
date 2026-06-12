"use client";

import {
  Activity,
  Bell,
  CloudRain,
  CloudSun,
  Gauge,
  LoaderCircle,
  PlugZap,
  Power,
  RadioTower,
  Sun,
  Waves,
  Wind,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContracts,
  useWriteContract,
} from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { base } from "wagmi/chains";
import { pocketWeatherBellAbi } from "@/lib/abi";
import {
  contractAddress,
  erc8021DataSuffix,
  isContractConfigured,
  wagmiConfig,
} from "@/lib/wagmi";

type RingKind = "Sunny" | "Rainy" | "Windy";
type FriendlyStatus =
  | "Ready"
  | "Choose a wallet"
  | "Pending"
  | "Confirmed"
  | "Failed"
  | "Request rejected"
  | "Contract setup pending";

const ringActions: Array<{
  kind: RingKind;
  functionName: "ringSunny" | "ringRainy" | "ringWindy";
  icon: typeof Sun;
  tone: string;
}> = [
  {
    kind: "Sunny",
    functionName: "ringSunny",
    icon: Sun,
    tone: "from-[#ffd85a] to-[#ff9f1c] text-[#3e2b00]",
  },
  {
    kind: "Rainy",
    functionName: "ringRainy",
    icon: CloudRain,
    tone: "from-[#6fb7ff] to-[#2457d6] text-white",
  },
  {
    kind: "Windy",
    functionName: "ringWindy",
    icon: Wind,
    tone: "from-[#b8c5cf] to-[#53616d] text-white",
  },
];

const contractReads = [
  { functionName: "totalSunnies" },
  { functionName: "totalRainies" },
  { functionName: "totalWindies" },
] as const;

function shortAddress(address?: `0x${string}`) {
  if (!address) return "Not connected";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function friendlyError(error: unknown): FriendlyStatus {
  const message =
    error && typeof error === "object" && "message" in error
      ? String(error.message)
      : "";

  if (
    message.toLowerCase().includes("reject") ||
    message.toLowerCase().includes("denied")
  ) {
    return "Request rejected";
  }

  return "Failed";
}

function countText(value: unknown) {
  return typeof value === "bigint" ? value.toString() : "0";
}

export default function Home() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContractAsync } = useWriteContract();
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [status, setStatus] = useState<FriendlyStatus>("Ready");
  const [lastAction, setLastAction] = useState("No rings yet");
  const [activeKind, setActiveKind] = useState<RingKind>();

  const readContracts = useMemo(() => {
    if (!isContractConfigured) return [];

    const shared = {
      address: contractAddress,
      abi: pocketWeatherBellAbi,
      chainId: base.id,
    } as const;

    return [
      ...(address
        ? [
            { ...shared, functionName: "userSunnies", args: [address] },
            { ...shared, functionName: "userRainies", args: [address] },
            { ...shared, functionName: "userWindies", args: [address] },
          ]
        : []),
      ...contractReads.map((read) => ({ ...shared, ...read })),
    ];
  }, [address]);

  const { data: reads, refetch } = useReadContracts({
    contracts: readContracts,
    query: {
      enabled: isContractConfigured && readContracts.length > 0,
      refetchInterval: 12_000,
    },
  });

  const offset = address ? 3 : 0;
  const mySunny = countText(reads?.[0]?.result);
  const myRainy = countText(reads?.[1]?.result);
  const myWindy = countText(reads?.[2]?.result);
  const totalSunny = countText(reads?.[offset]?.result);
  const totalRainy = countText(reads?.[offset + 1]?.result);
  const totalWindy = countText(reads?.[offset + 2]?.result);

  async function ringWeather(
    functionName: "ringSunny" | "ringRainy" | "ringWindy",
    kind: RingKind,
  ) {
    if (!isContractConfigured) {
      setStatus("Contract setup pending");
      setLastAction("Contract setup pending");
      return;
    }

    if (!isConnected) {
      setStatus("Choose a wallet");
      setWalletMenuOpen(true);
      return;
    }

    try {
      setStatus("Pending");
      setActiveKind(kind);
      setLastAction(`${kind} ring pending`);
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: pocketWeatherBellAbi,
        functionName,
        chainId: base.id,
        dataSuffix: erc8021DataSuffix,
      });
      await waitForTransactionReceipt(wagmiConfig, {
        hash,
        chainId: base.id,
      });
      setStatus("Confirmed");
      setLastAction(`${kind} ring confirmed`);
      await refetch();
    } catch (error) {
      console.error("Pocket Weather Bell transaction issue", error);
      const nextStatus = friendlyError(error);
      setStatus(nextStatus);
      setLastAction(
        nextStatus === "Request rejected"
          ? "Request rejected"
          : "Transaction failed. Please try again.",
      );
      setActiveKind(undefined);
    } finally {
      setActiveKind(undefined);
    }
  }

  const connectedToBase = chainId === base.id;

  return (
    <main className="min-h-screen bg-[#eef7ff] text-[#10202f]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-[8px] border border-[#c9d8e6] bg-white/90 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-[8px] bg-[#0052ff] text-white">
              <Bell size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#53616d]">
                Base Mini App
              </p>
              <h1 className="text-2xl font-semibold tracking-normal">
                Pocket Weather Bell
              </h1>
            </div>
          </div>

          <div className="relative flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-2 rounded-[8px] border border-[#d8e3ed] px-3 py-2 text-sm">
              <span
                className={`size-2 rounded-full ${
                  isConnected && connectedToBase
                    ? "bg-[#20b26b]"
                    : "bg-[#ffb02e]"
                }`}
              />
              {shortAddress(address)}
            </span>
            <button
              type="button"
              onClick={() =>
                isConnected
                  ? disconnect()
                  : setWalletMenuOpen((current) => !current)
              }
              className="flex h-10 items-center gap-2 rounded-[8px] bg-[#0052ff] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#003ec4]"
            >
              {isConnected ? <Power size={17} /> : <PlugZap size={17} />}
              {isConnected ? "Disconnect" : "Connect Wallet"}
            </button>
            {walletMenuOpen && !isConnected ? (
              <div className="absolute right-0 top-12 z-10 w-64 rounded-[8px] border border-[#c9d8e6] bg-white p-2 shadow-xl">
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    type="button"
                    onClick={() => {
                      connect({ connector, chainId: base.id });
                      setWalletMenuOpen(false);
                      setStatus("Ready");
                    }}
                    className="flex w-full items-center justify-between rounded-[6px] px-3 py-2 text-left text-sm font-medium hover:bg-[#edf5ff]"
                  >
                    {connector.name}
                    {isConnecting ? (
                      <LoaderCircle className="animate-spin" size={15} />
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[8px] border border-[#c9d8e6] bg-white p-4 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[8px] border border-[#d8e3ed] bg-[#f9fcff] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#53616d]">
                    Sky Index
                  </span>
                  <CloudSun className="text-[#ffb02e]" size={22} />
                </div>
                <p className="mt-4 text-3xl font-semibold">72</p>
                <div className="mt-3 h-2 rounded-full bg-[#dfeaf4]">
                  <div className="h-2 w-[72%] rounded-full bg-[#ffd85a]" />
                </div>
              </div>

              <div className="rounded-[8px] border border-[#d8e3ed] bg-[#f9fcff] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#53616d]">
                    Pressure
                  </span>
                  <Gauge className="text-[#0052ff]" size={22} />
                </div>
                <p className="mt-4 text-3xl font-semibold">1018</p>
                <p className="text-xs font-medium text-[#53616d]">hPa steady</p>
              </div>

              <div className="rounded-[8px] border border-[#d8e3ed] bg-[#f9fcff] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#53616d]">
                    Wind Dial
                  </span>
                  <Wind className="text-[#53616d]" size={22} />
                </div>
                <div className="mt-4 grid size-20 place-items-center rounded-full border-8 border-[#dfeaf4] border-t-[#0052ff] text-sm font-bold">
                  NE
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[8px] border border-[#d8e3ed] bg-[#10202f] p-4 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b8c5cf]">
                    Bell Meter
                  </span>
                  <RadioTower size={20} />
                </div>
                <p className="mt-4 text-4xl font-semibold">
                  {Number(totalSunny) + Number(totalRainy) + Number(totalWindy)}
                </p>
                <p className="text-sm text-[#d8e3ed]">total weather rings</p>
              </div>

              <div className="rounded-[8px] border border-[#d8e3ed] bg-[#f9fcff] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#53616d]">
                    Cloud Indicators
                  </span>
                  <Waves className="text-[#2457d6]" size={20} />
                </div>
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {[64, 42, 79, 57, 88].map((height, index) => (
                    <div
                      key={height}
                      className="flex h-24 items-end rounded-[6px] bg-[#eaf2fa] px-2"
                    >
                      <div
                        className={`w-full rounded-t-[6px] ${
                          index % 2 === 0 ? "bg-[#6fb7ff]" : "bg-[#b8c5cf]"
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-[8px] border border-[#c9d8e6] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#53616d]">
                  Station Status
                </p>
                <h2 className="text-xl font-semibold">Live Controls</h2>
              </div>
              <Activity className="text-[#0052ff]" size={24} />
            </div>
            <div className="mt-4 space-y-3">
              {ringActions.map((action) => {
                const Icon = action.icon;
                const busy = status === "Pending" && activeKind === action.kind;

                return (
                  <button
                    key={action.kind}
                    type="button"
                    onClick={() =>
                      ringWeather(action.functionName, action.kind)
                    }
                    className={`flex h-14 w-full items-center justify-between rounded-[8px] bg-gradient-to-r px-4 text-base font-semibold shadow-sm transition hover:scale-[1.01] ${action.tone}`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={20} />
                      Ring {action.kind}
                    </span>
                    {busy ? (
                      <LoaderCircle className="animate-spin" size={18} />
                    ) : (
                      <Bell size={18} />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 rounded-[8px] border border-[#d8e3ed] bg-[#f9fcff] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#53616d]">
                Last Transaction
              </p>
              <p className="mt-2 text-sm font-semibold">
                {lastAction}
              </p>
              <p className="mt-1 text-sm text-[#53616d]">{status}</p>
            </div>
          </aside>
        </section>

        <section className="grid gap-4 lg:grid-cols-4">
          {[
            ["My Sunny Rings", mySunny, "Total Sunny Rings", totalSunny, Sun],
            [
              "My Rainy Rings",
              myRainy,
              "Total Rainy Rings",
              totalRainy,
              CloudRain,
            ],
            ["My Windy Rings", myWindy, "Total Windy Rings", totalWindy, Wind],
          ].map(([mineLabel, mine, totalLabel, total, Icon]) => {
            const TileIcon = Icon as typeof Sun;
            return (
              <div
                key={mineLabel as string}
                className="rounded-[8px] border border-[#c9d8e6] bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <TileIcon className="text-[#0052ff]" size={22} />
                  <span className="rounded-[6px] bg-[#edf5ff] px-2 py-1 text-xs font-semibold text-[#0052ff]">
                    Base
                  </span>
                </div>
                <p className="mt-4 text-sm font-medium text-[#53616d]">
                  {mineLabel as string}
                </p>
                <p className="text-3xl font-semibold">{mine as string}</p>
                <p className="mt-3 text-sm font-medium text-[#53616d]">
                  {totalLabel as string}
                </p>
                <p className="text-2xl font-semibold">{total as string}</p>
              </div>
            );
          })}

          <div className="rounded-[8px] border border-[#c9d8e6] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <PlugZap className="text-[#0052ff]" size={22} />
              <span className="rounded-[6px] bg-[#eef7ff] px-2 py-1 text-xs font-semibold">
                Wallet
              </span>
            </div>
            <p className="mt-4 text-sm font-medium text-[#53616d]">
              Wallet Status
            </p>
            <p className="text-lg font-semibold">
              {isConnected ? "Connected" : "Not connected"}
            </p>
            <p className="mt-3 text-sm font-medium text-[#53616d]">Network</p>
            <p className="text-lg font-semibold">
              {isConnected
                ? connectedToBase
                  ? "Base"
                  : "Switch to Base"
                : "Waiting"}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
