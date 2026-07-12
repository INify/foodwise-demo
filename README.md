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

First, install Homebrew (if not already installed), then run:

```bash
brew install node
```

**Windows (Scoop):**

First, install Scoop (if not already installed), then run:

```bash
scoop install nodejs
```

## Installation

Clone the repository:

```bash
git clone https://github.com/INify/foodwise-demo.git
cd foodwise-demo
```

Install dependencies:

```bash
npm install
```

### Additional Dependencies
This project uses React Navigation Bottom Tabs for the main navigation. Install it with:

```bash
npm install @react-navigation/bottom-tabs
```

This project also uses react-native-qrcode-svg for QR code generation, which requires react-native-svg:
```bash
npm install react-native-svg
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

| Command | Description |
|---------|-------------|
| `npx expo start` | Start the Expo development server |
| `npx expo start --android` | Start and launch on Android |
| `npx expo start --ios` | Start and launch on iOS |
| `npx expo start --web` | Start and launch on web |

## Attributions

- **Mystery Box Icon** — Mystery box icons created by syafii5758 - Flaticon

## Tech Stack

| Technology | Version |
|------------|---------|
| **Framework** | Expo (SDK 54) / React Native (0.81) |
| **Language** | JavaScript (React 19.1) |
| **Navigation** | React Navigation (Stack Navigator + Bottom Tabs) |
| **Other** | React Native Gesture Handler, QR Code SVG, Safe Area Context |

## Screens & Features

### Authentication
| Screen | Description |
|--------|-------------|
| **Login** | User login with email and password validation |
| **Register** | New user registration with role selection (Customer / Vendor) |

### Customer Features
| Screen | Description |
|--------|-------------|
| **Home** | Browse available surplus food listings with personalized greeting |
| **Browse** | Full listing view with search, category filters, and time range filters |
| **Listing Detail** | View food details, description, pricing, and add to cart |
| **Cart** | Review and confirm orders |
| **QR Code** | Generate pickup QR code for orders |
| **Impact** | Track environmental impact with eco-level, badges, and weekly stats |
| **Profile** | User profile with stats, settings, and badge collection |

### Vendor Features
| Screen | Description |
|--------|-------------|
| **Vendor Dashboard** | Overview of vendor's performance and stats |
| **Vendor Listings** | Manage and create food listings |
| **Vendor Orders** | View and manage incoming orders |
| **Vendor Order Detail** | View specific order details and status |
| **Vendor Scanner** | Scan customer QR codes for pickup verification |
| **Add Listing** | Create new food listings with image upload and category selection |

### Home Screen Sections
| Section | Description |
|---------|-------------|
| **Welcome Greeting** | Personalized welcome message with user's name |
| **Search Bar** | Search for surplus food by name or vendor |
| **Blind Box Deals** | Horizontal scroll of mystery meal boxes at discounted prices |
| **Closing Soon** | Two-column grid of urgent listings about to expire |
| **Impact Card** | Quick stats: Meals Saved, CO₂ Saved, Active Vendors |
| **Nearby Vendors** | Horizontal scroll of partner vendors in your area |
| **Popular Now** | Horizontal scroll of trending food items |

### Browse Screen Features
| Feature | Description |
|---------|-------------|
| **Search** | Search listings by food name or vendor |
| **Time Range Filter** | Filter by Daily / Weekly / Monthly impact data |
| **Category Filter** | Filter by All / Halal / Non-Halal / Vegetarian |

### Impact Screen Features
| Feature | Description |
|---------|-------------|
| **Eco Level** | Dynamic level based on meals saved (Beginner → Zero Waste Hero) |
| **Stats** | Meals Rescued, CO₂ Saved, RM Saved |
| **Progress Bar** | Track progress to the next badge milestone |
| **Weekly Chart** | Visual representation of meals rescued per day |
| **Badge Collection** | Earn badges for reaching milestones (5 badges available) |
| **Government Initiative** | MySaveFood Programme information banner |

### Profile Screen Features
| Feature | Description |
|---------|-------------|
| **User Info** | Display name, email, and current eco level |
| **Quick Stats** | Meals Rescued, CO₂ Saved, RM Saved |
| **Settings Menu** | Edit Profile, Notifications, Location, My QR Code, All Badges, Help & Support |
| **Sign Out** | Secure logout functionality |

### Validation Features
| Feature | Description |
|---------|-------------|
| **Email Validation** | Validates proper email format (xxx@yyy.zzz) |
| **Password Validation** | Requires minimum 8 characters |
| **Real-time Feedback** | Error messages appear below invalid fields |
| **Auto-clear Errors** | Errors disappear when user starts typing |

### Color Theme
| Color | Hex | Usage |
|-------|-----|-------|
| Primary (Deep Green) | `#1B5E20` | Headers, titles, main elements |
| Primary Light | `#2E7D32` | Secondary elements |
| Secondary (Warm Orange) | `#E85D3A` | CTA buttons, highlights |
| Dark | `#263238` | Primary text |
| Gray Dark | `#757575` | Secondary text |
| Gray Light | `#EEEEEE` | Backgrounds, input fields |

## Updated Features (v1.0)
✅ Bottom tab navigation (Home / Browse / Impact / Profile)

✅ Blind Box Deals section with horizontal scrolling

✅ Closing Soon section with two-column layout

✅ Nearby Vendors section

✅ Popular Now section

✅ Eco Level and Badge Collection on Impact screen

✅ Email and password validation on Login/Register

✅ Personalized welcome message

✅ Updated color theme (deep green + warm orange)

✅ Vendor dashboard with AI Demand Prediction and Smart Match

✅ Vendor badge system (Eco Level & Eco Score)

✅ Add Listing screen with image upload and category selection

## License

This project is for educational purposes as part of a university assignment.
