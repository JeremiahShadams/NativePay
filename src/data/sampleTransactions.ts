import { TransactionRecord } from '../types';

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-1',
    timestamp: 'Today, 11:24 AM',
    type: 'sent',
    title: 'Sent to @vitalik.eth',
    subtitle: 'Sent via Arbitrum',
    amount: 0.25,
    currency: 'ETH',
    fiatAmount: 825.00,
    status: 'completed',
    txHash: '0x8f2a...49bc'
  },
  {
    id: 'tx-2',
    timestamp: 'Today, 09:15 AM',
    type: 'received',
    title: 'Received from Silicon Valley Bank',
    subtitle: 'Wire transfer • ACH #491028',
    amount: 2500.00,
    currency: 'USD',
    fiatAmount: 2500.00,
    status: 'completed',
  },
  {
    id: 'tx-3',
    timestamp: 'Yesterday, 8:40 PM',
    type: 'swapped',
    title: 'Swapped SOL to Native Token',
    subtitle: 'Swapped via Native Exchange',
    amount: 5.0,
    currency: 'SOL',
    fiatAmount: 950.00,
    status: 'completed',
    txHash: '5K3d...8e21'
  },
  {
    id: 'tx-4',
    timestamp: 'Nov 07, 3:12 PM',
    type: 'sent',
    title: 'QR Payment: Blue Bottle Coffee',
    subtitle: 'QR payment • Blue Bottle Coffee',
    amount: 6.80,
    currency: 'USDC',
    fiatAmount: 6.80,
    status: 'completed',
  }
];

