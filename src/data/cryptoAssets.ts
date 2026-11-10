import { CryptoAsset } from '../types';

export const INITIAL_CRYPTO_ASSETS: CryptoAsset[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    balance: 0.3542,
    fiatValue: 33649.00,
    priceUsd: 95000.00,
    change24h: 3.42,
    icon: '₿',
    network: 'Bitcoin Native',
    color: '#F7931A'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    balance: 4.2500,
    fiatValue: 14025.00,
    priceUsd: 3300.00,
    change24h: 5.18,
    icon: 'Ξ',
    network: 'Ethereum Mainnet',
    color: '#627EEA'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    balance: 42.8000,
    fiatValue: 8132.00,
    priceUsd: 190.00,
    change24h: -1.24,
    icon: '◎',
    network: 'Solana High-Speed',
    color: '#14F195'
  },
  {
    id: 'native',
    name: 'Native Token',
    symbol: 'NAT',
    balance: 15400.0,
    fiatValue: 3080.00,
    priceUsd: 0.20,
    change24h: 18.95,
    icon: '✦',
    network: 'Native L2 Rollup',
    color: '#3B82F6'
  },
  {
    id: 'usd-coin',
    name: 'USD Coin',
    symbol: 'USDC',
    balance: 5210.50,
    fiatValue: 5210.50,
    priceUsd: 1.00,
    change24h: 0.01,
    icon: '$',
    network: 'Multi-Chain',
    color: '#2775CA'
  }
];

