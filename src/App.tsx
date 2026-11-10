import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { DeviceFrame } from './components/common/DeviceFrame';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { INITIAL_CRYPTO_ASSETS } from './data/cryptoAssets';
import { INITIAL_TRANSACTIONS } from './data/sampleTransactions';
import { CryptoAsset, TransactionRecord, PaymentRequest, OnboardingStep } from './types';
import { sounds } from './utils/soundEffects';

export const App: React.FC = () => {
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [currentView, setCurrentView] = useState<'onboarding' | 'dashboard'>('onboarding');
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('splash');

  const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>(INITIAL_CRYPTO_ASSETS);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);

  // Handle agent-executed payment after explicit user approval
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
      subtitle: `Agent verified • ${payment.destination.network || 'L2 Route'}`,
      amount: payment.amount,
      currency: payment.currency,
      fiatAmount: payment.fiatEquivalent,
      status: 'completed',
      icon: '↗',
      txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  const getActiveTitle = () => {
    if (currentView === 'dashboard') {
      return 'Native App & AI Payment Agent';
    }
    switch (onboardingStep) {
      case 'splash':
        return 'Native Minimalist Splash (Screen 0)';
      case 'stories':
        return 'Revolut-Style Welcome Stories (Screens 0-3)';
      case 'phone_input':
        return 'Phone Number Input & Keypad (Screens 4-8)';
      case 'otp_verify':
        return '6-Digit SMS Verification (Screens 10-12)';
      case 'instant_notifications':
        return 'Push Notifications Setup (Screen 13)';
      case 'country_residence':
        return 'Country of Residence & Legal (Screen 14)';
      case 'legal_name':
        return 'Official ID Name Input (Screens 15-16)';
      case 'identity_kyc':
        return 'Identity Verification & Fast ID (Screen 17)';
      case 'purpose_tags':
        return 'What do you want to use Native for? (Screens 18-19)';
      case 'profile_tag':
        return 'Set @nativetag & Avatar (Screens 20-21)';
      case 'privacy':
        return 'Data & AI Customization (Screen 22)';
      case 'plan_selection':
        return 'Native Metal / Premium Plan Selection (Screen 23)';
      default:
        return 'Onboarding';
    }
  };

  return (
    <DeviceFrame
      isMobileFrame={isMobileFrame}
      onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
      activeScreenTitle={getActiveTitle()}
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
    backgroundColor: '#000000',
  },
});

export default App;

