# PocketWeatherBell

PocketWeatherBell is a Base Mini App for ringing a simple onchain weather bell.

The app is built with Next.js, TypeScript, Wagmi, Viem, and Tailwind CSS.

Repository: https://github.com/AntonioJessie/pocket-weather-bell.git

## Overview

PocketWeatherBell is intentionally small and focused.

It provides one interaction: choose a weather mood and write that choice onchain.

The app exposes three write actions:

- Ring Sunny
- Ring Rainy
- Ring Windy

Each action sends a contract interaction on Base.

The matching Solidity source is included in the repository:

- `contracts/PocketWeatherBell.sol`

PocketWeatherBell does not sell credits, charge an app fee, add rewards, or include invite mechanics.

Users only pay the Base gas required for the contract interaction.

## Features

- Base Mini App experience
- Next.js application structure
- TypeScript source code
- Wagmi and Viem integration
- Tailwind CSS styling
- Three clear onchain weather actions
- Solidity contract source included
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

App verification metadata is defined in:

- `src/app/layout.tsx`

Chain interaction configuration is defined in:
