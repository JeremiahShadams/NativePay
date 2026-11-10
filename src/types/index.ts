export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  fiatValue: number;
  priceUsd: number;
  change24h: number;
  icon: string;
  network: string;
  color: string;
}

export interface BankAccount {
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  iban: string;
  bic: string;
  fiatBalance: number;
  currency: string;
}

export interface PaymentDestination {
  type: 'crypto_wallet' | 'account_number' | 'qr_code' | 'nativetag';
  rawInput: string;
  resolvedName?: string;
  resolvedAddress?: string;
  accountNumber?: string;
  routingOrBic?: string;
  network?: string;
  suggestedCurrency?: string;
  suggestedAmount?: number;
  riskScore: 'low' | 'medium' | 'high';
  riskExplanation?: string;
  isVerifiedMerchant?: boolean;
}

export interface PaymentRequest {
  id: string;
  destination: PaymentDestination;
  amount: number;
  currency: string;
  fiatEquivalent: number;
  networkFeeUsd: number;
  estimatedSeconds: number;
  note?: string;
  agentAnalysis: {
    safetySummary: string;
    routeDetails: string;
    slippageEst: string;
    counterpartyTrust: string;
  };
}

export interface TransactionRecord {
  id: string;
  timestamp: string;
  type: 'sent' | 'received' | 'swapped';
  title: string;
  subtitle: string;
  amount: number;
  currency: string;
  fiatAmount: number;
  status: 'completed' | 'pending' | 'failed';
  icon: string;
  txHash?: string;
}

export type OnboardingStep =
  | 'stories'
  | 'phone_input'
  | 'phone_confirm_modal'
  | 'otp_verify'
  | 'otp_error_modal'
  | 'instant_notifications'
  | 'country_residence'
  | 'legal_name'
  | 'identity_kyc'
  | 'purpose_tags'
  | 'profile_tag'
  | 'privacy'
  | 'plan_selection'
  | 'completed';

