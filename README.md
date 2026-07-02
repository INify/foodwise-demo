# FoodWise Demo

A React Native (Expo) mobile application for reducing food waste by connecting users with surplus food listings from local vendors at discounted prices.

## Prerequisites

Before running the app, make sure you have the following installed:

- **Node.js** (v16 or later)
- **npm**
- **Expo CLI** — Install globally via `npm install -g expo-cli`
- A mobile device with the **Expo Go** app installed (iOS / Android), or an emulator / simulator

### Installing Node.js

**macOS (Homebrew):**

First, [install Homebrew](https://brew.sh/) (if not already installed), then run:

```bash
brew install node
```

**Windows (Scoop):**

First, [install Scoop](https://scoop.sh/) (if not already installed), then run:

```powershell
scoop install nodejs
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/INify/foodwise-demo.git
   cd foodwise-demo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Running the App

Start the Expo development server:

```bash
npx expo start
```

This will open the Expo developer tools in your browser and display a QR code in the terminal.

- **On a physical device:** Open the **Expo Go** app on your iOS or Android device and scan the QR code from the terminal.
- **On an iOS simulator:** Press `i` in the terminal to launch the iOS simulator.
- **On an Android emulator:** Press `a` in the terminal to launch the Android emulator.
- **On the web:** Press `w` in the terminal to open the app in a web browser.

## Available Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npx expo start`   | Start the Expo development server    |
| `npx expo start --android` | Start and launch on Android   |
| `npx expo start --ios`     | Start and launch on iOS       |
| `npx expo start --web`     | Start and launch on web       |

## Attributions

- **Mystery Box Icon** — <a href="https://www.flaticon.com/free-icons/mystery-box" title="mystery box icons">Mystery box icons created by syafii5758 - Flaticon</a>

## Tech Stack

- **Framework:** [Expo](https://expo.dev/) (SDK 54) / [React Native](https://reactnative.dev/) (0.81)
- **Language:** JavaScript (React 19.1)
- **Navigation:** [React Navigation](https://reactnavigation.org/) (Stack Navigator)
- **Other:** React Native Gesture Handler, QR Code SVG, Safe Area Context

## Screens

- **Login / Register** — User authentication
- **Home** — Browse available surplus food listings
- **Listing Detail** — View food details and add to cart
- **Cart** — Review and confirm orders
- **QR Code** — Generate pickup QR code for orders
- **Impact** — Track your environmental impact (food saved, CO₂ reduced)
- **Vendor Dashboard** — Vendor-facing panel for managing listings