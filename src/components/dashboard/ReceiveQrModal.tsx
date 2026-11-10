import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, Copy, Check, QrCode, Share2, Sparkles, ShieldCheck } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface ReceiveQrModalProps {
  visible: boolean;
  onClose: () => void;
  userHandle: string;
}

export const ReceiveQrModal: React.FC<ReceiveQrModalProps> = ({
  visible,
  onClose,
  userHandle = '@alex',
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState('Ethereum / L2');
  const [copied, setCopied] = useState(false);

  const networks = [
    { id: 'eth', name: 'Ethereum / L2', address: '0x71C8824A3297aD448bC954e3f169B0D8976C8824' },
    { id: 'sol', name: 'Solana High-Speed', address: '8F3sn9VKa2dZpQx8mR5TyU1kWBj4vN7eD6eK91L2p3qR' },
    { id: 'btc', name: 'Bitcoin SegWit', address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq' },
    { id: 'nat', name: 'Native L2 Rollup', address: '0x71C8824A3297aD448bC954e3f169B0D8976C8824' },
  ];

  const currentNet = networks.find((n) => n.name === selectedNetwork) || networks[0];

  const handleCopy = () => {
    sounds.playKeyClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Receive Crypto & Fiat</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Network Switcher Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.networkScroll}>
            {networks.map((net) => (
              <TouchableOpacity
                key={net.id}
                style={[
                  styles.networkChip,
                  selectedNetwork === net.name && styles.networkChipActive,
                ]}
                onPress={() => {
                  sounds.playKeyClick();
                  setSelectedNetwork(net.name);
                }}
              >
                <Text
                  style={[
                    styles.networkChipText,
                    selectedNetwork === net.name && styles.networkChipTextActive,
                  ]}
                >
                  {net.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* QR Code Card */}
          <View style={styles.qrCard}>
            <View style={styles.qrOuter}>
              {/* Synthetic visual QR display with Native monogram center */}
              <View style={styles.qrGrid}>
                {/* Simulated QR Code Blocks */}
                <View style={styles.qrMatrixBlockTL} />
                <View style={styles.qrMatrixBlockTR} />
                <View style={styles.qrMatrixBlockBL} />
                <View style={styles.qrCenterBadge}>
                  <Text style={styles.qrBadgeText}>N</Text>
                </View>
              </View>
            </View>

            <Text style={styles.qrOwnerTag}>{userHandle} • native.me/{userHandle.replace('@', '')}</Text>
            <Text style={styles.networkIndicator}>
              Send only {currentNet.name} assets to this address
            </Text>
          </View>

          {/* Address Display & Copy */}
          <View style={styles.addressBox}>
            <View style={styles.addressTextCol}>
              <Text style={styles.addressLabel}>Wallet Deposit Address</Text>
              <Text style={styles.addressVal} numberOfLines={1}>
                {currentNet.address}
              </Text>
            </View>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
              {copied ? (
                <View style={styles.copiedRow}>
                  <Check size={14} color="#10b981" />
                  <Text style={styles.copiedText}>Copied</Text>
                </View>
              ) : (
                <View style={styles.copyRow}>
                  <Copy size={14} color="#60a5fa" />
                  <Text style={styles.copyText}>Copy</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Security Assurance */}
          <View style={styles.securityBox}>
            <ShieldCheck size={16} color="#10b981" />
            <Text style={styles.securityText}>
              Autonomous Agent auto-detects incoming deposits and credits immediately across L2 routes.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#0c0f18',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  networkScroll: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  networkChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  networkChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#3b82f6',
  },
  networkChipText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  networkChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  qrCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  qrOuter: {
    width: 170,
    height: 170,
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  qrGrid: {
    width: 150,
    height: 150,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrMatrixBlockTL: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 38,
    height: 38,
    borderWidth: 4,
    borderColor: '#ffffff',
    borderRadius: 6,
  },
  qrMatrixBlockTR: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 38,
    height: 38,
    borderWidth: 4,
    borderColor: '#ffffff',
    borderRadius: 6,
  },
  qrMatrixBlockBL: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    width: 38,
    height: 38,
    borderWidth: 4,
    borderColor: '#ffffff',
    borderRadius: 6,
  },
  qrCenterBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  qrBadgeText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  qrOwnerTag: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  networkIndicator: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 4,
  },
  addressBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 14,
  },
  addressTextCol: {
    flex: 1,
    marginRight: 10,
  },
  addressLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  addressVal: {
    color: '#ffffff',
    fontSize: 13,
    fontFamily: 'monospace',
  },
  copyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  copyText: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '700',
  },
  copiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  copiedText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '700',
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
  },
  securityText: {
    color: '#a7f3d0',
    fontSize: 11,
    lineHeight: 15,
    flex: 1,
  },
});

