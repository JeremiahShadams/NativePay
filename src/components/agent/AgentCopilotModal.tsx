import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  X,
  Sparkles,
  Zap,
  Send,
  ShieldCheck,
  Bot,
  User,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { PaymentRequest, CryptoAsset } from '../../types';
import { sounds } from '../../utils/soundEffects';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  paymentDraft?: {
    recipient: string;
    amount: number;
    currency: string;
    network: string;
    fee: number;
    riskScore: string;
  };
}

interface AgentCopilotModalProps {
  visible: boolean;
  onClose: () => void;
  cryptoAssets: CryptoAsset[];
  onRequestApproval: (payment: PaymentRequest) => void;
}

export const AgentCopilotModal: React.FC<AgentCopilotModalProps> = ({
  visible,
  onClose,
  cryptoAssets,
  onRequestApproval,
}) => {
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'agent',
      text: 'Hello Alex! I am your Native Autonomous Payment Agent. You can tell me to pay any address, scan a QR code, or transfer funds across chains. I will always calculate the lowest fee route and ask for your approval before signing.',
    },
  ]);

  const quickPrompts = [
    'Send 0.15 ETH to vitalik.eth',
    'Pay $12.50 USDC to Blue Bottle Coffee',
    'Transfer 2.0 SOL to Bob',
    'Verify address 0x71C...8824',
  ];

  const handleSendPrompt = (promptText?: string) => {
    const textToSend = promptText || inputText;
    if (!textToSend.trim() || isThinking) return;

    sounds.playKeyClick();
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    // Simulate agent natural language understanding and execution planning
    setTimeout(() => {
      setIsThinking(false);
      sounds.playSuccessChime();

      let currency = 'ETH';
      let amount = 0.15;
      let recipient = 'vitalik.eth (0xd8dA6...6045)';
      let network = 'Arbitrum One L2';

      const lower = textToSend.toLowerCase();
      if (lower.includes('sol')) {
        currency = 'SOL';
        amount = 2.0;
        recipient = 'Bob (@bob.sol)';
        network = 'Solana High-Speed';
      } else if (lower.includes('usdc') || lower.includes('coffee') || lower.includes('12.5')) {
        currency = 'USDC';
        amount = 12.5;
        recipient = 'Blue Bottle Coffee Roasters';
        network = 'Base L2 Rollup';
      } else if (lower.includes('nat') || lower.includes('native')) {
        currency = 'NAT';
        amount = 100;
        recipient = 'Native Staking Vault';
        network = 'Native L2 Rollup';
      }

      const agentMsg: Message = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: `I have prepared the payment of ${amount} ${currency} to ${recipient}. I screened the destination against sanctions and phishing registries (0 exploits reported) and routed it via ${network} for an estimated gas fee of $0.08.\n\nPlease review and grant your approval below to execute.`,
        paymentDraft: {
          recipient,
          amount,
          currency,
          network,
          fee: 0.08,
          riskScore: '0.01% (Safe)',
        },
      };

      setMessages((prev) => [...prev, agentMsg]);
    }, 1200);
  };

  const handleLaunchApproval = (draft: NonNullable<Message['paymentDraft']>) => {
    sounds.playKeyClick();
    const asset = cryptoAssets.find((a) => a.symbol === draft.currency);
    const fiatVal = draft.amount * (asset ? asset.priceUsd : 1.0);

    const req: PaymentRequest = {
      id: `pay-ai-${Date.now()}`,
      destination: {
        type: 'crypto_wallet',
        rawInput: draft.recipient,
        resolvedName: draft.recipient,
        network: draft.network,
        riskScore: 'low',
        isVerifiedMerchant: true,
      },
      amount: draft.amount,
      currency: draft.currency,
      fiatEquivalent: fiatVal,
      networkFeeUsd: draft.fee,
      estimatedSeconds: 2,
      agentAnalysis: {
        safetySummary: 'Counterparty verified by Agent Copilot. 0 exploits reported.',
        routeDetails: `Direct atomic settlement via ${draft.network}.`,
        slippageEst: '0.00%',
        counterpartyTrust: '99.9%',
      },
    };

    onClose();
    onRequestApproval(req);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.agentTitleRow}>
              <View style={styles.agentAvatar}>
                <Bot size={20} color="#60a5fa" />
              </View>
              <View>
                <View style={styles.statusBadgeRow}>
                  <Text style={styles.agentName}>Native Copilot</Text>
                  <View style={styles.activePill}>
                    <View style={styles.greenDot} />
                    <Text style={styles.activeText}>ONLINE</Text>
                  </View>
                </View>
                <Text style={styles.agentSub}>Autonomous Payment & Gas Optimization Agent</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Chat Messages Body */}
          <ScrollView style={styles.chatScroll} showsVerticalScrollIndicator={false}>
            {messages.map((m) => (
              <View
                key={m.id}
                style={[
                  styles.msgWrapper,
                  m.sender === 'user' ? styles.userMsgWrapper : styles.agentMsgWrapper,
                ]}
              >
                <View
                  style={[
                    styles.msgBubble,
                    m.sender === 'user' ? styles.userBubble : styles.agentBubble,
                  ]}
                >
                  <Text style={styles.msgText}>{m.text}</Text>

                  {/* Payment Draft Card inside Agent Message */}
                  {m.paymentDraft && (
                    <View style={styles.draftCard}>
                      <View style={styles.draftHeader}>
                        <Zap size={14} color="#60a5fa" />
                        <Text style={styles.draftTitle}>Payment Ready for Approval</Text>
                      </View>

                      <View style={styles.draftDetails}>
                        <View style={styles.draftRow}>
                          <Text style={styles.draftLabel}>To:</Text>
                          <Text style={styles.draftVal} numberOfLines={1}>
                            {m.paymentDraft.recipient}
                          </Text>
                        </View>
                        <View style={styles.draftRow}>
                          <Text style={styles.draftLabel}>Amount:</Text>
                          <Text style={styles.draftAmountHighlight}>
                            {m.paymentDraft.amount} {m.paymentDraft.currency}
                          </Text>
                        </View>
                        <View style={styles.draftRow}>
                          <Text style={styles.draftLabel}>Route:</Text>
                          <Text style={styles.draftVal}>{m.paymentDraft.network}</Text>
                        </View>
                        <View style={styles.draftRow}>
                          <Text style={styles.draftLabel}>Fee:</Text>
                          <Text style={styles.draftFee}>${m.paymentDraft.fee.toFixed(2)}</Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.reviewBtn}
                        onPress={() => handleLaunchApproval(m.paymentDraft!)}
                        activeOpacity={0.85}
                      >
                        <ShieldCheck size={16} color="#000000" />
                        <Text style={styles.reviewBtnText}>Review & Authorize Payment</Text>
                        <ArrowRight size={14} color="#000000" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))}

            {isThinking && (
              <View style={[styles.msgWrapper, styles.agentMsgWrapper]}>
                <View style={[styles.msgBubble, styles.agentBubble, styles.thinkingBubble]}>
                  <ActivityIndicator size="small" color="#60a5fa" />
                  <Text style={styles.thinkingText}>Agent analyzing route & safety...</Text>
                </View>
              </View>
            )}

            <View style={{ height: 16 }} />
          </ScrollView>

          {/* Quick Prompt Pills */}
          <View style={styles.quickPromptsRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {quickPrompts.map((p, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.promptChip}
                  onPress={() => handleSendPrompt(p)}
                >
                  <Sparkles size={11} color="#60a5fa" />
                  <Text style={styles.promptChipText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Input Bar */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.chatInput}
              placeholder="Ask agent to pay, scan, or verify..."
              placeholderTextColor="#64748b"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSendPrompt()}
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                !inputText.trim() && styles.sendBtnDisabled,
              ]}
              onPress={() => handleSendPrompt()}
              disabled={!inputText.trim() || isThinking}
            >
              <Send size={16} color={inputText.trim() ? '#ffffff' : '#64748b'} />
            </TouchableOpacity>
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
    height: '88%',
    paddingTop: 16,
    paddingHorizontal: 18,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  agentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  agentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#3b82f6',
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  agentName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  activeText: {
    color: '#10b981',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  agentSub: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatScroll: {
    flex: 1,
    paddingVertical: 14,
  },
  msgWrapper: {
    marginBottom: 12,
    maxWidth: '88%',
  },
  userMsgWrapper: {
    alignSelf: 'flex-end',
  },
  agentMsgWrapper: {
    alignSelf: 'flex-start',
  },
  msgBubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userBubble: {
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 4,
  },
  agentBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  msgText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
  },
  thinkingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  thinkingText: {
    color: '#94a3b8',
    fontSize: 13,
  },
  draftCard: {
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.35)',
  },
  draftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  draftTitle: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  draftDetails: {
    gap: 4,
    marginBottom: 10,
  },
  draftRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  draftLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  draftVal: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    maxWidth: 160,
  },
  draftAmountHighlight: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  draftFee: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
  },
  reviewBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  reviewBtnText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '700',
  },
  quickPromptsRow: {
    paddingVertical: 8,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  promptChipText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    outlineStyle: 'none' as unknown as string,
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: 'transparent',
  },
});
