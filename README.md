# Native — Intelligent Autonomous Crypto & Banking App

<div align="center">

![Native Logo](https://img.shields.io/badge/Native-Financial%20Intelligence-2563eb?style=for-the-badge&logo=react&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.88-61dafb?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<p align="center">
  <b>Rebuilt from the Revolut iOS design architecture into an elevated, next-generation Web3 neobank powered by React Native and an Autonomous AI Payment Agent.</b>
</p>

[Quick Start](#-quick-start) • [Features](#-key-features) • [Onboarding Flow](#-revolut-inspired-onboarding-24-screens) • [AI Payment Agent](#-autonomous-ai-payment-agent) • [Architecture](#-architecture--tech-stack)

</div>

---

## 📖 Overview

**Native** takes the benchmark mobile financial experience of Revolut's iOS onboarding and banking UI and elevates it into a unified crypto and fiat platform. Engineered natively with **React Native** components and styled in an obsidian dark-mode aesthetic with electric cobalt accents, Native introduces an **Autonomous AI Payment Agent** that inspects QR codes, wallet addresses, and bank accounts, optimizes gas across Layer-2 networks, and **always requests explicit user approval** before executing any transaction.

---

## ✨ Key Features

### 1. 🤖 Autonomous AI Payment Agent (*Core Innovation*)
- **QR Payment Code Scanner**: Viewfinder with animated targeting reticles, pulsating laser scanning line, torch toggle, and built-in merchant presets (*Blue Bottle Coffee USDC, Alice ETH, Swiss IBAN QR-Bill*).
- **Universal Recipient Parser**: Automatically detects and validates:
  - **EVM Addresses** (`0x...`) & ENS domains (`vitalik.eth`)
  - **Solana Addresses** (`7xKXtg...`)
  - **Bitcoin Addresses** (`bc1q...`)
  - **Bank Accounts** (IBAN, ACH account + routing numbers)
  - **Nativetags** (`@username`)
- **Gas & Anti-Fraud Simulation**: AI inspects counterparty smart contracts, screens against blacklists, and finds the lowest-cost Layer-2 route.
- **Interactive User Approval Sheet**:
  - Full breakdown: Recipient verified badge, exact crypto amount, USD fiat conversion, network route, and fee.
  - Risk report: `0.01% (Safe)` safety guarantee.
  - **Biometric Slide-to-Approve**: Press to authenticate with simulated Face ID / Touch ID. The agent broadcasts the transaction only after you grant consent.
  - Immediate balance deduction, transaction hash generation, and dynamic activity feed update.

### 2. 📱 Complete 24-Screen Revolut-Inspired Onboarding
Every screen from the Mobbin Revolut iOS design system has been reconstructed:
- **Stories Carousel (Screens 0–3)**: Auto-advancing story bars, 3D embossed `N` coin with speedlines, stacked metal cards, and live crypto badges.
- **Phone Auth & Custom Keypad (Screens 4–8)**: Flag dial code selector, auto-formatting `(650) 213-7390`, and an authentic iOS numeric keypad.
- **Country Picker Modal (Screen 5)**: Filterable search list with national flags.
- **Phone Confirmation Bottom Sheet (Screen 9)**: Centered badge verification.
- **6-Digit OTP Verification (Screens 10–12)**: 6 individual digit cells with countdown timer and built-in shortcuts:
  - *Auto-Fill Code (`824-915`)* for instant success flow.
  - *Test Error Modal (`000-000`)* to display the exact red `✕` *"Incorrect code entered"* bottom sheet.
- **Instant Notifications (Screen 13)**: Floating notification graphic and permissions.
- **Country of Residence (Screen 14)**: Regulatory terms, E-sign, and Lead Bank consent.
- **Legal ID Name (Screens 15–16)**: First Name, Last Name, and optional Alias fields.
- **Identity KYC Gateway (Screen 17)**: Fast ID (⚡ 30s) vs Document Upload.
- **Purpose Selection Grid (Screens 18–19)**: Interactive emoji tag pills across Everyday Needs, Global Spending, and Crypto & AI Intelligence.
- **Profile Tag & Avatar (Screens 20–21)**: Custom `@nativetag` handle validator with live availability feedback (`✓ Nativetag available`).
- **Privacy & AI Settings (Screen 22)**: Interactive toggle switch.
- **Plan Selection (Screen 23)**: Native Metal & Premium plan switcher with perks carousel (NordVPN, Tinder Plus, Freeletics, Picsart).

### 3. 💳 Active Banking & Crypto Dashboard
- **Net Worth Display**: `$48,950.40 USD` with 24h P&L indicator and balance privacy toggle.
- **Live Crypto Holdings**: Real-time asset cards for Bitcoin (BTC), Ethereum (ETH), Solana (SOL), Native Token (NAT), and USD Coin (USDC).
- **Interactive Metal Card Widget**: Native Obsidian Titanium Card with flip animation, card freeze toggle, and cardholder details.
- **Real-Time Transaction Activity**: Sent, received, and swapped transaction receipts.

### 4. 🔊 Synthesized Web Audio System
Native-sounding iOS click feedback, camera scanner beeps, and payment success chime synthesized directly via the Web Audio API without external audio file dependencies.

---

## 🛠️ Architecture & Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React Native** (`0.88`) | Cross-platform mobile UI primitives (`View`, `Text`, `StyleSheet`, `TouchableOpacity`, `Modal`, `ScrollView`, `TextInput`) |
| **React Native Web** | Universal rendering engine enabling instantaneous browser preview on Windows/macOS/Linux |
| **TypeScript** (`5.7`) | End-to-end type safety for payment requests, assets, transactions, and onboarding states |
| **Vite** (`6.1`) | Sub-second HMR development server and optimized production bundler |
| **Tailwind CSS** (`3.4`) | Dark mode gradient mesh and responsive layout utilities |
| **Lucide Icons** | Crisp vector iconography for fintech actions |
| **Web Audio API** | Pure synthesizer audio feedback (key clicks, scan beeps, success chime) |

---

## 📂 Project Structure

```
Crypto exchange app/
├── Examples/                       # Original Revolut iOS reference screenshots (0–23)
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── DeviceFrame.tsx     # iPhone 16 Pro mockup chassis with Fullscreen toggle
│   │   │   └── NumericKeypad.tsx   # iOS-style numeric keypad (1-9, 0, +*#, backspace)
│   │   ├── onboarding/
│   │   │   ├── OnboardingFlow.tsx  # Central onboarding state coordinator
│   │   │   ├── StorySlides.tsx     # 3D Coin, Cards stack, and Invest story slides
│   │   │   ├── PhoneInputStep.tsx  # Phone entry with keypad & loading state
│   │   │   ├── CountryPickerModal.tsx # Searchable country flag modal
│   │   │   ├── PhoneConfirmModal.tsx  # "Is this number correct?" bottom sheet
│   │   │   ├── OtpVerificationStep.tsx # 6-digit OTP code cells with test shortcuts
│   │   │   ├── OtpErrorModal.tsx   # "Incorrect code entered" error sheet
│   │   │   ├── InstantNotificationsStep.tsx
│   │   │   ├── CountryResidenceStep.tsx
│   │   │   ├── LegalNameStep.tsx
│   │   │   ├── IdentityKycStep.tsx
│   │   │   ├── PurposeTagsStep.tsx # Everyday, Global, and Crypto tag grid
│   │   │   ├── ProfileTagStep.tsx  # @nativetag handle setup & avatar picker
│   │   │   ├── PrivacyStep.tsx     # Intelligent matching toggle
│   │   │   └── PlanSelectionStep.tsx # Metal / Premium plans & perks carousel
│   │   ├── dashboard/
│   │   │   └── MainDashboard.tsx   # Portfolio, Net Worth, Quick Actions, Metal Card
│   │   └── payment/
│   │       ├── PaymentHubModal.tsx # Unified payment hub (paste address & scan QR)
│   │       ├── QrScannerModal.tsx  # Camera viewfinder simulator with test presets
│   │       └── PaymentApprovalSheet.tsx # AI Agent approval modal with biometric slider
│   ├── data/
│   │   ├── countries.ts            # Country codes, dial codes, and flag emojis
│   │   ├── cryptoAssets.ts         # Portfolio data (BTC, ETH, SOL, NAT, USDC)
│   │   └── sampleTransactions.ts   # Historical transaction records
│   ├── utils/
│   │   └── soundEffects.ts         # Web Audio API synthesizer
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   ├── App.tsx                     # Top-level state and view switcher
│   ├── main.tsx                    # Web entry point
│   └── index.css                   # Global styles and font definitions
├── index.js                        # Native entry point for React Native CLI / Expo
├── app.json                        # Expo & mobile app manifest
├── vite.config.ts                  # Vite config with React Native Web alias
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies and scripts
└── README.md                       # Repository documentation
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: Version 18 or higher (tested with Node.js v26)
- **npm** or **pnpm**

### 2. Installation
```bash
npm install --legacy-peer-deps
```

### 3. Run in Development (Web Preview)
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to experience the live application.

### 4. Build for Production
```bash
npm run build
```

### 5. Running on iOS / Android via React Native CLI or Expo
To run on a physical device or simulator:
```bash
# Using Expo
npx expo start

# Using React Native CLI
npx react-native run-ios
npx react-native run-android
```

---

## 💡 How the AI Payment Flow Works

```
1. Initiate:
   Tap "Pay with AI" or "Scan QR" on the dashboard.

2. Input Recipient:
   - Scan a QR code (use test presets or camera)
   - OR paste an EVM address, ENS (vitalik.eth), Solana address, or Bank Account.

3. Agent Deep Analysis:
   The Agent inspects counterparty risk, queries contract reputation, and calculates the optimal gas route.

4. User Approval Sheet:
   The Agent displays an interactive approval modal detailing the recipient, amount in crypto + fiat, network route, and fee.

5. User Authorization:
   The user approves with biometric authentication or slide-to-confirm. Once approved, the payment executes, plays a success chime, deducts funds, and logs the receipt.
```

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
