import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, Copy, Check, ShieldCheck } from 'lucide-react-native';
import { sounds } from '../../utils/soundEffects';
import { colors, radius, space, type } from '../../theme';

interface ReceiveQrModalProps {
  visible: boolean;
  onClose: () => void;
  userHandle: string;
}

/** Size of the rendered QR matrix, in modules. */
const QR_SIZE = 21;

const finderValue = (row: number, col: number, top: number, left: number): boolean | null => {
  const r = row - top;
  const c = col - left;
  if (r < 0 || r > 6 || c < 0 || c > 6) return null;
  const onBorder = r === 0 || r === 6 || c === 0 || c === 6;
  const inCore = r >= 2 && r <= 4 && c >= 2 && c <= 4;
  return onBorder || inCore;
};

/** Deterministic QR-style matrix so each address produces a stable pattern. */
const buildMatrix = (seed: string): boolean[][] => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const rand = () => {
    h ^= h << 13;
    h >>>= 0;
    h ^= h >>> 17;
    h ^= h << 5;
    h >>>= 0;
    return h / 4294967296;
  };

  const finders: Array<[number, number]> = [
    [0, 0],
    [0, QR_SIZE - 7],
    [QR_SIZE - 7, 0],
  ];

  const rows: boolean[][] = [];
  for (let r = 0; r < QR_SIZE; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < QR_SIZE; c++) {
      let value: boolean | null = null;
      for (const [fr, fc] of finders) {
        const f = finderValue(r, c, fr, fc);
        if (f !== null) {
          value = f;
          break;
        }
      }
      if (value === null) {
        if (r === 6) value = c % 2 === 0;
        else if (c === 6) value = r % 2 === 0;
        else value = rand() > 0.52;
      }
      row.push(value);
    }
    rows.push(row);
  }
  return rows;
};

export const ReceiveQrModal: React.FC<ReceiveQrModalProps> = ({
  visible,
  onClose,
  userHandle = '@alex',
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState('Ethereum / L2');
  const [copied, setCopied] = useState(false);

  const networks = [
    { id: 'eth', name: 'Ethereum / L2', address: '0x71C8824A3297aD448bC954e3f169B0D8976C8824' },
    { id: 'sol', name: 'Solana', address: '8F3sn9VKa2dZpQx8mR5TyU1kWBj4vN7eD6eK91L2p3qR' },
    { id: 'btc', name: 'Bitcoin', address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq' },
    { id: 'nat', name: 'Native L2', address: '0x71C8824A3297aD448bC954e3f169B0D8976C8824' },
  ];

  const currentNet = networks.find((n) => n.name === selectedNetwork) || networks[0];
  const matrix = useMemo(() => buildMatrix(currentNet.address), [currentNet.address]);

  const handleCopy = () => {
    sounds.playKeyClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Receive</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close">
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

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

          <View style={styles.qrCard}>
            <View style={styles.qrFrame}>
              <View style={styles.qrMatrix}>
                {matrix.map((row, r) => (
                  <View key={r} style={styles.qrRow}>
                    {row.map((on, c) => (
                      <View key={c} style={[styles.qrCell, on && styles.qrCellOn]} />
                    ))}
                  </View>
                ))}
              </View>
            </View>

            <Text style={styles.qrOwnerTag}>
              {userHandle} · native.me/{userHandle.replace('@', '')}
            </Text>
            <Text style={styles.networkIndicator}>
              Send only {currentNet.name} assets to this address
            </Text>
          </View>

          <View style={styles.addressBox}>
            <View style={styles.addressTextCol}>
              <Text style={styles.addressLabel}>Deposit address</Text>
              <Text style={styles.addressVal} numberOfLines={1}>
                {currentNet.address}
              </Text>
            </View>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
              {copied ? (
                <View style={styles.copyRow}>
                  <Check size={14} color={colors.positive} />
                  <Text style={styles.copiedText}>Copied</Text>
                </View>
              ) : (
                <View style={styles.copyRow}>
                  <Copy size={14} color={colors.textSecondary} />
                  <Text style={styles.copyText}>Copy</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.securityBox}>
            <ShieldCheck size={16} color={colors.textSecondary} />
            <Text style={styles.securityText}>
              Deposits are credited after the network confirms the transaction.
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
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.sheet,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingTop: space.lg,
    paddingHorizontal: space.xl,
    paddingBottom: space.xxl,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.lg,
  },
  headerTitle: {
    ...type.sheetTitle,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  networkScroll: {
    flexDirection: 'row',
    marginBottom: space.lg,
  },
  networkChip: {
    paddingHorizontal: space.md,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    marginRight: space.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  networkChipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  networkChipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  networkChipTextActive: {
    color: colors.accent,
    fontWeight: '700',
  },
  qrCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: space.xl,
    alignItems: 'center',
    marginBottom: space.lg,
  },
  qrFrame: {
    backgroundColor: colors.white,
    padding: space.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.onLightHairline,
    marginBottom: space.md,
  },
  qrMatrix: {
    width: QR_SIZE * 8,
    height: QR_SIZE * 8,
  },
  qrRow: {
    flexDirection: 'row',
  },
  qrCell: {
    width: 8,
    height: 8,
    backgroundColor: 'transparent',
  },
  qrCellOn: {
    backgroundColor: colors.onLight,
  },
  qrOwnerTag: {
    color: colors.onLight,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  networkIndicator: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: space.xs,
  },
  addressBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: space.md,
  },
  addressTextCol: {
    flex: 1,
    marginRight: space.md,
  },
  addressLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  addressVal: {
    color: colors.text,
    fontSize: 13,
    fontFamily: 'monospace',
  },
  copyBtn: {
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceRaised,
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  copyText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  copiedText: {
    color: colors.positive,
    fontSize: 12,
    fontWeight: '700',
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: colors.surface,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  securityText: {
    ...type.caption,
    flex: 1,
  },
});
