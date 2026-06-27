# PocketWeatherBell

PocketWeatherBell is a Base Mini App for ringing a simple onchain weather bell.

The app is built with Next.js, TypeScript, Wagmi, Viem, and Tailwind CSS.

Repository: https://github.com/AntonioJessie/pocket-weather-bell.git

## Overview

PocketWeatherBell focuses on one small interaction: choosing a weather mood and writing that choice onchain.

The interface exposes exactly three write actions:

- Ring Sunny
- Ring Rainy
- Ring Windy

Each action sends a contract interaction on Base.

The matching Solidity source is available at:

- `contracts/PocketWeatherBell.sol`

The app does not sell credits, charge an app fee, add rewards, or include invite mechanics.

Users only pay the Base gas required for the contract interaction.

## Features

- Base Mini App experience
- Next.js application structure
- TypeScript source code
- Wagmi and Viem integration
- Tailwind CSS styling
- Three clear onchain actions
- Solidity contract source included in the repository
- Production metadata configured in the app source
- Deployment headers included for Base App iframe surfaces

## Project Structure

Important files and directories include:

- `src/app/layout.tsx`  
  Contains Base and Talent app verification metadata.

- `src/lib/wagmi.ts`  
  Contains the Base app id, deployed contract address, and ERC-8021 data suffix.

- `contracts/PocketWeatherBell.sol`  
  Contains the matching Solidity contract source.

- `vercel.json`  
  Includes headers needed for iframe embedding in Base App surfaces.

## App Configuration

Production configuration is stored directly in the application source.

The app verification metadata is defined in:

- `src/app/layout.tsx`

The chain interaction configuration is defined in:

- `src/lib/wagmi.ts`

Every `writeContractAsync` call explicitly passes `dataSuffix`.

The Wagmi configuration also includes the same `dataSuffix`.

When updating deployment details, keep these values aligned.

## Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local app in your browser:

```text
http://localhost:3000
```

## Usage

Run the app locally or deploy it to a supported hosting environment.

Open the app and choose one of the available actions:

- Ring Sunny
- Ring Rainy
- Ring Windy

Confirm the transaction when prompted by the connected wallet.

After confirmation, the selected weather bell action is written onchain.

## Verification

Before committing or deploying changes, run the standard checks.

Lint the project:

```bash
npm run lint
```

Build the project:

```bash
