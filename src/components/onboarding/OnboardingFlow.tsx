import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { OnboardingStep } from '../../types';
import { SplashScreen } from './SplashScreen';
import { StorySlides } from './StorySlides';
import { PhoneInputStep } from './PhoneInputStep';
import { OtpVerificationStep } from './OtpVerificationStep';
import { InstantNotificationsStep } from './InstantNotificationsStep';
import { CountryResidenceStep } from './CountryResidenceStep';
import { LegalNameStep } from './LegalNameStep';
import { IdentityKycStep } from './IdentityKycStep';
import { PurposeTagsStep } from './PurposeTagsStep';
import { ProfileTagStep } from './ProfileTagStep';
import { PrivacyStep } from './PrivacyStep';
import { PlanSelectionStep } from './PlanSelectionStep';

interface OnboardingFlowProps {
  onCompleteOnboarding: () => void;
  onLogInToDashboard: () => void;
  currentStep?: OnboardingStep;
  onStepChange?: (step: OnboardingStep) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onCompleteOnboarding,
  onLogInToDashboard,
  currentStep: externalStep,
  onStepChange,
}) => {
  const [internalStep, setInternalStep] = useState<OnboardingStep>('splash');
  const [userPhone, setUserPhone] = useState('+1 (650) 213-7390');
  const [, setUserName] = useState('Alex Smith');
  const [, setUserHandle] = useState('@alex');

  const step = externalStep || internalStep;

  const goTo = (nextStep: OnboardingStep) => {
    setInternalStep(nextStep);
    if (onStepChange) onStepChange(nextStep);
  };

  return (
    <View style={styles.container}>
      {step === 'splash' && (
        <SplashScreen onFinish={() => goTo('stories')} />
      )}

      {step === 'stories' && (
        <StorySlides
          onCreateAccount={() => goTo('phone_input')}
          onLogIn={onLogInToDashboard}
        />
      )}

      {step === 'phone_input' && (
        <PhoneInputStep
          onBack={() => goTo('stories')}
          onContinue={(fullPhone) => {
            setUserPhone(fullPhone);
            goTo('otp_verify');
          }}
          onLogIn={onLogInToDashboard}
        />
      )}

      {step === 'otp_verify' && (
        <OtpVerificationStep
          phoneNumber={userPhone}
          onBack={() => goTo('phone_input')}
          onVerified={() => goTo('instant_notifications')}
        />
      )}

      {step === 'instant_notifications' && (
        <InstantNotificationsStep
          onBack={() => goTo('otp_verify')}
          onContinue={() => goTo('country_residence')}
        />
      )}

      {step === 'country_residence' && (
        <CountryResidenceStep
          onBack={() => goTo('instant_notifications')}
          onContinue={() => goTo('legal_name')}
        />
      )}

      {step === 'legal_name' && (
        <LegalNameStep
          onBack={() => goTo('country_residence')}
          onContinue={(nameData) => {
            setUserName(`${nameData.firstName} ${nameData.lastName}`);
            goTo('identity_kyc');
          }}
        />
      )}

      {step === 'identity_kyc' && (
        <IdentityKycStep
          onBack={() => goTo('legal_name')}
          onSelectMethod={() => goTo('purpose_tags')}
        />
      )}

      {step === 'purpose_tags' && (
        <PurposeTagsStep
          onBack={() => goTo('identity_kyc')}
          onContinue={() => goTo('profile_tag')}
        />
      )}

      {step === 'profile_tag' && (
        <ProfileTagStep
          onBack={() => goTo('purpose_tags')}
          onContinue={(handle) => {
            setUserHandle(handle);
            goTo('privacy');
          }}
        />
      )}

      {step === 'privacy' && (
        <PrivacyStep
          onBack={() => goTo('profile_tag')}
          onContinue={() => goTo('plan_selection')}
        />
      )}

      {step === 'plan_selection' && (
        <PlanSelectionStep
          onBack={() => goTo('privacy')}
          onSelectPlan={() => onCompleteOnboarding()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

