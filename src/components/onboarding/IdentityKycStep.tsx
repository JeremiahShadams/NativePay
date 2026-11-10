import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, ChevronRight, Zap, FileText, ShieldCheck } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface IdentityKycStepProps {
  onBack: () => void;
  onSelectMethod: (method: 'fast_id' | 'documents') => void;
}

export const IdentityKycStep: React.FC<IdentityKycStepProps> = ({
  onBack,
  onSelectMethod,
}) => {
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
        <Text style={styles.title}>Verify your identity</Text>
        <Text style={styles.subtitle}>
          Select your preferred verification method to unlock instant crypto swaps and global banking.
        </Text>

        <View style={styles.cardsColumn}>
          {/* Option 1: Fast ID */}
          <TouchableOpacity
            style={styles.methodCard}
            onPress={() => {
              sounds.playSuccessChime();
              onSelectMethod('fast_id');
            }}
            activeOpacity={0.75}
          >
            <View style={styles.methodHeader}>
              <View style={styles.iconCircleFast}>
                <Zap size={22} color="#60a5fa" />
              </View>
              <View style={styles.methodTextContainer}>
                <Text style={styles.methodTitle}>Verify using Fast ID</Text>
                <Text style={styles.methodDesc}>
                  Instant and hassle free verification using Government Database
                </Text>
                <View style={styles.fasterBadge}>
                  <Zap size={11} color="#ffffff" />
                  <Text style={styles.fasterBadgeText}>Faster • 30 seconds</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#94a3b8" />
            </View>
          </TouchableOpacity>

          {/* Option 2: Document Upload */}
          <TouchableOpacity
            style={styles.methodCard}
            onPress={() => {
              sounds.playKeyClick();
              onSelectMethod('documents');
            }}
            activeOpacity={0.75}
          >
            <View style={styles.methodHeader}>
              <View style={styles.iconCircleDocs}>
                <FileText size={22} color="#94a3b8" />
              </View>
              <View style={styles.methodTextContainer}>
                <Text style={styles.methodTitle}>Verify using documents</Text>
                <Text style={styles.methodDesc}>
                  Enter your details and upload your documents (Passport / ID / Driver's License)
                </Text>
              </View>
              <ChevronRight size={20} color="#94a3b8" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Security Assurance Footer */}
        <View style={styles.securityNote}>
          <ShieldCheck size={18} color="#10b981" />
          <Text style={styles.securityNoteText}>
            256-bit bank-grade biometric encryption. Your identity documents never leave your encrypted enclave.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080a10',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  topNav: {
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
    flex: 1,
    paddingTop: 12,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 28,
  },
  cardsColumn: {
    gap: 16,
  },
  methodCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCircleFast: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleDocs: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodTextContainer: {
    flex: 1,
    gap: 4,
  },
  methodTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  methodDesc: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 18,
  },
  fasterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 6,
    gap: 4,
  },
  fasterBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    padding: 14,
    borderRadius: 14,
    marginTop: 'auto',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
  },
  securityNoteText: {
    color: '#a7f3d0',
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
});

