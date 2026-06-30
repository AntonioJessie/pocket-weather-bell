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
