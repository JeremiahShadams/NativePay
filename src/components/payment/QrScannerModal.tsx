import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Camera, Zap, X, Flashlight, QrCode, Sparkles, Upload } from 'lucide-react-native';
import { PaymentDestination } from '../../types';
import { sounds } from '../../utils/soundEffects';

interface QrScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onQrDetected: (destination: PaymentDestination, amount?: number, currency?: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  visible,
  onClose,
  onQrDetected,
}) => {
  const [torchOn, setTorchOn] = useState(false);

  const sampleQrs = [
    {
      id: 'qr-1',
      title: 'Merchant: Blue Bottle Coffee',
      tag: 'USDC Payment Request',
      destination: {
        type: 'qr_code' as const,
        rawInput: 'solana:7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU?amount=4.50&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        resolvedName: 'Blue Bottle Coffee Roasters',
        resolvedAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
        network: 'Solana High-Speed',
        riskScore: 'low' as const,
        isVerifiedMerchant: true,
      },
      amount: 4.5,
      currency: 'USDC',
    },
    {
      id: 'qr-2',
      title: 'Alice (alice.eth)',
      tag: 'ETH Invoice: Lunch Share',
      destination: {
        type: 'qr_code' as const,
        rawInput: 'ethereum:0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045?value=0.15e18',
        resolvedName: 'Alice (@alice.eth)',
        resolvedAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        network: 'Arbitrum One L2',
        riskScore: 'low' as const,
        isVerifiedMerchant: false,
      },
      amount: 0.15,
      currency: 'ETH',
    },
    {
      id: 'qr-3',
      title: 'Swiss IBAN QR-Bill',
      tag: 'Bank Transfer • CHF 1,200',
      destination: {
        type: 'qr_code' as const,
        rawInput: 'SPC:CH4209000000123456789:NativeFintechAG',
        resolvedName: 'Native Technologies AG (Zurich)',
        accountNumber: 'CH42 0900 0000 1234 5678 9',
        network: 'SEPA Instant / Swiss QR',
        riskScore: 'low' as const,
        isVerifiedMerchant: true,
      },
      amount: 1200,
      currency: 'USD',
    },
  ];

  const handleSelectPreset = (sample: typeof sampleQrs[0]) => {
    sounds.playScanBeep();
    onQrDetected(sample.destination, sample.amount, sample.currency);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={22} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scan QR Payment Code</Text>
            <TouchableOpacity
              onPress={() => setTorchOn(!torchOn)}
              style={[styles.torchBtn, torchOn && styles.torchBtnActive]}
            >
              <Flashlight size={18} color={torchOn ? '#ffffff' : '#94a3b8'} />
            </TouchableOpacity>
          </View>

          {/* Viewfinder Area */}
          <View style={styles.viewfinderContainer}>
            <View style={styles.viewfinderFrame}>
              {/* Corner Reticles */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />

              {/* Laser Scanning Line */}
              <View style={styles.laserScanLine} />

              {/* Center Guidance */}
              <View style={styles.centerGuidance}>
                <QrCode size={40} color="rgba(255, 255, 255, 0.25)" />
                <Text style={styles.guidanceText}>Align QR code within frame</Text>
              </View>
            </View>

            <Text style={styles.subGuidanceText}>
              Autonomous Agent will decode and verify recipient instantly
            </Text>
          </View>

          {/* Tap-to-Test QR Presets */}
          <View style={styles.presetsSection}>
            <View style={styles.presetsHeader}>
              <Sparkles size={14} color="#60a5fa" />
              <Text style={styles.presetsTitle}>Test Invoices (Tap to Scan instantly):</Text>
            </View>

            <View style={styles.presetsList}>
              {sampleQrs.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={styles.presetItem}
                  onPress={() => handleSelectPreset(s)}
                  activeOpacity={0.7}
                >
                  <View style={styles.presetIcon}>
                    <QrCode size={18} color="#3b82f6" />
                  </View>
                  <View style={styles.presetInfo}>
                    <Text style={styles.presetName}>{s.title}</Text>
                    <Text style={styles.presetTag}>{s.tag}</Text>
                  </View>
                  <Text style={styles.presetAmount}>
                    {s.amount} {s.currency}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#080a10',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  torchBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  torchBtnActive: {
    backgroundColor: '#2563eb',
  },
  viewfinderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  viewfinderFrame: {
    width: 240,
    height: 240,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#3b82f6',
  },
  cornerTL: {
    top: 10,
    left: 10,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: 10,
    right: 10,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: 10,
    left: 10,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 10,
    right: 10,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  laserScanLine: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: '#3b82f6',
    shadowColor: '#60a5fa',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  centerGuidance: {
    alignItems: 'center',
    gap: 8,
  },
  guidanceText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    fontWeight: '500',
  },
  subGuidanceText: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 16,
    textAlign: 'center',
  },
  presetsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  presetsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  presetsTitle: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  presetsList: {
    gap: 8,
  },
  presetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  presetIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  presetInfo: {
    flex: 1,
  },
  presetName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  presetTag: {
    color: '#94a3b8',
    fontSize: 11,
  },
  presetAmount: {
    color: '#60a5fa',
    fontSize: 13,
    fontWeight: '700',
  },
});

