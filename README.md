# Pocket Weather Bell

Pocket Weather Bell is a Base Mini App built with Next.js, TypeScript, Wagmi, Viem, and Tailwind CSS. It exposes exactly three onchain write actions:

- Ring Sunny
- Ring Rainy
- Ring Windy

The app does not issue a token, sell credits, charge an app fee, add rewards, or add invite mechanics. Users only pay the Base gas required for the contract interaction.

The matching Solidity source is in `contracts/PocketWeatherBell.sol`.

## App Configuration

Production configuration is set in the app source:

- `src/app/layout.tsx`: Base and Talent app verification metadata.
- `src/lib/wagmi.ts`: Base app id, deployed contract address, and ERC-8021 data suffix.

Every `writeContractAsync` call explicitly passes `dataSuffix`, and the Wagmi config also includes the same `dataSuffix`.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run lint
npm run build
```

## Deployment Notes

The repository includes `vercel.json` headers to allow iframe embedding for Base App surfaces. Disable Vercel Deployment Protection before base.dev verification.
