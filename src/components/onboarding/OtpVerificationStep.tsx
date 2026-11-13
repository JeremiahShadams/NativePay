import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { NumericKeypad } from '../common/NumericKeypad';
import { OtpErrorModal } from './OtpErrorModal';
import { sounds } from '../../utils/soundEffects';
import { colors, radius, space, type } from '../../theme';

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

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const verifyCode = (codeStr: string) => {
    if (codeStr === '000000') {
      sounds.playErrorBuzzer();
      setTimeout(() => setShowErrorModal(true), 300);
    } else {
      sounds.playSuccessChime();
      setTimeout(onVerified, 500);
    }
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.topNav}>
        <TouchableOpacity
          onPress={() => {
            sounds.playKeyClick();
            onBack();
          }}
          style={styles.backBtn}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Enter your code</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to {phoneNumber || '+1 •••• 7390'}
        </Text>

        <View style={styles.cellsRow}>
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const hasVal = digits[index] !== undefined;
            const isCurrent = digits.length === index;

            return (
              <React.Fragment key={index}>
                {index === 3 && <View style={styles.cellGap} />}
                <View
                  style={[
                    styles.cellBox,
                    isCurrent && styles.cellBoxActive,
                    hasVal && styles.cellBoxFilled,
                  ]}
                >
                  {hasVal ? <View style={styles.filledDot} /> : null}
                  {!hasVal && isCurrent ? <View style={styles.cursor} /> : null}
                </View>
              </React.Fragment>
            );
          })}
        </View>

        <View style={styles.resendRow}>
          {countdown > 0 && digits.length < 6 ? (
            <Text style={styles.resendTimerText}>
              Resend code in 00:{countdown < 10 ? `0${countdown}` : countdown}
            </Text>
          ) : (
            <TouchableOpacity onPress={() => setCountdown(30)}>
              <Text style={styles.resendActionText}>Send a new code</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {digits.length < 6 && (
        <View style={styles.bottomArea}>
          <NumericKeypad
            onDigitPress={handleDigitPress}
            onBackspace={handleBackspace}
            showExtraSymbols={false}
          />
        </View>
      )}

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
    backgroundColor: colors.background,
    justifyContent: 'space-between',
  },
  topNav: {
    paddingHorizontal: space.lg,
    paddingTop: space.xs,
    height: 40,
    justifyContent: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -space.sm,
  },
  content: {
    paddingHorizontal: space.xl,
    paddingTop: space.sm,
  },
  title: {
    ...type.screenTitle,
    marginBottom: space.xs,
  },
  subtitle: {
    ...type.body,
    marginBottom: space.xxl,
  },
  cellsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    marginBottom: space.xl,
  },
  cellBox: {
    width: 44,
    height: 52,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellBoxActive: {
    borderColor: colors.accent,
  },
  cellBoxFilled: {
    borderColor: colors.borderStrong,
  },
  filledDot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.text,
  },
  cursor: {
    width: 2,
    height: 22,
    backgroundColor: colors.accent,
  },
  cellGap: {
    width: space.sm,
  },
  resendRow: {
    alignItems: 'flex-start',
    marginBottom: space.xl,
  },
  resendTimerText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  resendActionText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  bottomArea: {
    paddingHorizontal: space.lg,
    paddingBottom: space.xs,
  },
});
