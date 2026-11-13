import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { DeviceFrame } from './components/common/DeviceFrame';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { INITIAL_CRYPTO_ASSETS } from './data/cryptoAssets';
import { INITIAL_TRANSACTIONS } from './data/sampleTransactions';
import { CryptoAsset, TransactionRecord, PaymentRequest, OnboardingStep } from './types';
import { sounds } from './utils/soundEffects';
import { colors } from './theme';

export const App: React.FC = () => {
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [currentView, setCurrentView] = useState<'onboarding' | 'dashboard'>('onboarding');
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('splash');

  const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>(INITIAL_CRYPTO_ASSETS);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);

  // Apply a payment after the user approves it
  const handleExecutePayment = (payment: PaymentRequest) => {
    // 1. Deduct asset balance
    setCryptoAssets((prevAssets) =>
      prevAssets.map((asset) => {
        if (asset.symbol === payment.currency) {
          const newBal = Math.max(0, asset.balance - payment.amount);
          return {
            ...asset,
            balance: parseFloat(newBal.toFixed(4)),
            fiatValue: parseFloat((newBal * asset.priceUsd).toFixed(2)),
          };
        }
        return asset;
      })
    );

    // 2. Add transaction to recent activity
    const newTx: TransactionRecord = {
      id: payment.id,
      timestamp: 'Just now',
      type: 'sent',
      title: `Sent to ${payment.destination.resolvedName || payment.destination.accountNumber || payment.destination.rawInput.slice(0, 10) + '...'}`,
      subtitle: `Sent via ${payment.destination.network || 'instant transfer'}`,
      amount: payment.amount,
      currency: payment.currency,
      fiatAmount: payment.fiatEquivalent,
      status: 'completed',
      txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  return (
    <DeviceFrame
      isMobileFrame={isMobileFrame}
      onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
      isDashboardActive={currentView === 'dashboard'}
      onResetOnboarding={() => {
        sounds.playKeyClick();
        setOnboardingStep('stories');
        setCurrentView('onboarding');
      }}
      onJumpToDashboard={() => {
        sounds.playKeyClick();
        setCurrentView('dashboard');
      }}
    >
      <View style={styles.appContainer}>
        {currentView === 'onboarding' ? (
          <OnboardingFlow
            currentStep={onboardingStep}
            onStepChange={(s) => setOnboardingStep(s)}
            onCompleteOnboarding={() => setCurrentView('dashboard')}
            onLogInToDashboard={() => setCurrentView('dashboard')}
          />
        ) : (
          <MainDashboard
            cryptoAssets={cryptoAssets}
            transactions={transactions}
            onExecutePayment={handleExecutePayment}
            onOpenOnboardingTour={() => {
              sounds.playKeyClick();
              setOnboardingStep('stories');
              setCurrentView('onboarding');
            }}
          />
        )}
      </View>
    </DeviceFrame>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;

