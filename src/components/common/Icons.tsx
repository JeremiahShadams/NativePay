import { Platform } from 'react-native';
import * as NativeIcons from 'lucide-react-native';
import * as WebIcons from 'lucide-react';

// Use lucide-react-native on iOS/Android (react-native-svg) and lucide-react on web
const Icons = Platform.OS === 'web' ? WebIcons : NativeIcons;

export const {
  Zap,
  QrCode,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Eye,
  EyeOff,
  ChevronRight,
  RefreshCw,
  X,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Delete,
  Smartphone,
  Monitor,
  Search,
  ChevronDown,
  Camera,
  FileText,
  Flashlight,
  Upload,
  Lock,
  Unlock,
  ArrowUpDown,
  Bot,
  User,
  Send,
  Building,
  Wallet,
  AlertTriangle,
  AlertCircle,
  Bell,
  Globe,
  Award,
} = (Platform.OS === 'web' ? WebIcons : NativeIcons) as typeof NativeIcons;

export default Icons;
