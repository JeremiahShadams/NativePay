import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { NumericKeypad } from '../common/NumericKeypad';
import { OtpErrorModal } from './OtpErrorModal';
import { sounds } from '../../utils/soundEffects';

interface OtpVerificationStepProps {
  phoneNumber: string;
  onBack: () => void;
  onVerified: () => void;
}

export const OtpVerificationStep: React.FC<OtpVerificationStepProps> = ({
  phoneNumber,
  onBack,
  onVerified,
}) => {
  const [digits, setDigits] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(15);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleDigitPress = (digit: string) => {
    if (digits.length < 6) {
      const newDigits = [...digits, digit];
      setDigits(newDigits);

      if (newDigits.length === 6) {
        verifyCode(newDigits.join(''));
      }
    }
  };

  const handleBackspace = () => {
    setDigits((prev) => prev.slice(0, -1));
  };

  const verifyCode = (codeStr: string) => {
    if (codeStr === '000000') {
      // Intentional test failure for Revolut screenshot 12
      sounds.playErrorBuzzer();
      setTimeout(() => {
        setShowErrorModal(true);
      }, 300);
    } else {
      // Valid code
      sounds.playSuccessChime();
      setTimeout(() => {
        onVerified();
      }, 500);
    }
  };

  const fillCorrectCode = () => {
    sounds.playKeyClick();
    const code = ['8', '2', '4', '9', '1', '5'];
    setDigits(code);
    verifyCode(code.join(''));
  };

  const fillErrorCode = () => {
    sounds.playKeyClick();
    const code = ['0', '0', '0', '0', '0', '0'];
    setDigits(code);
    verifyCode(code.join(''));
  };

  return (
    <View style={styles.container}>
      {/* Top Nav */}
      <View style={styles.topNav}>
        <TouchableOpacity
          onPress={() => {
            sounds.playKeyClick();
            onBack();
          }}
          style={styles.backBtn}
        >
          <ArrowLeft size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>6-digit code</Text>
        <Text style={styles.subtitle}>
          Enter the code sent to {phoneNumber || '+1 •••• 7390'}
        </Text>

        {/* 6 Digit Cells: [ · ] [ · ] [ · ]  -  [ · ] [ · ] [ · ] */}
        <View style={styles.cellsRow}>
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const hasVal = digits[index] !== undefined;
            const isCurrent = digits.length === index;

            return (
              <React.Fragment key={index}>
                {index === 3 && <Text style={styles.cellSeparator}>-</Text>}
                <View
                  style={[
                    styles.cellBox,
                    isCurrent && styles.cellBoxActive,
                    hasVal && styles.cellBoxFilled,
                  ]}
                >
                  {hasVal ? (
                    <View style={styles.filledDot} />
                  ) : isCurrent ? (
                    <View style={styles.blinkingCursor} />
                  ) : null}
                </View>
              </React.Fragment>
            );
          })}
        </View>

        {/* Resend Code or Timer */}
        <View style={styles.resendRow}>
          {countdown > 0 ? (
            <Text style={styles.resendTimerText}>
              Resend code in 00:{countdown < 10 ? `0${countdown}` : countdown}
            </Text>
          ) : (
            <TouchableOpacity onPress={() => setCountdown(30)}>
              <Text style={styles.resendActionText}>No code received? Resend code</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Numeric Keypad */}
      <View style={styles.bottomArea}>
        <NumericKeypad
          onDigitPress={handleDigitPress}
          onBackspace={handleBackspace}
          showExtraSymbols={false}
        />
      </View>

      {/* Error Bottom Sheet Modal (Screenshot 12) */}
      <OtpErrorModal
        visible={showErrorModal}
        onDismiss={() => {
          setShowErrorModal(false);
          setDigits([]);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  topNav: {
    paddingHorizontal: 16,
    paddingTop: 4,
    height: 40,
    justifyContent: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 28,
  },
  cellsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  cellBox: {
    width: 44,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellBoxActive: {
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
  },
  cellBoxFilled: {
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  filledDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  blinkingCursor: {
    width: 2,
    height: 22,
    backgroundColor: '#3b82f6',
  },
  cellSeparator: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 20,
    fontWeight: '700',
    marginHorizontal: 2,
  },
  resendRow: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  resendTimerText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    fontWeight: '500',
  },
  resendActionText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  testChipsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  testLabel: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  testChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
    gap: 5,
  },
  testChipError: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  testChipText: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomArea: {
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
});

