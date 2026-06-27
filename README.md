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
