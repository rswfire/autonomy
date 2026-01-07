// components/Icon.tsx
import {
    AlertCircle,
    BookOpen,
    Bot,
    Castle,
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Compass,
    Computer,
    CreditCard,
    Database,
    Droplets,
    Edit,
    Eye,
    EyeOff,
    FileText,
    Flame,
    HelpCircle,
    History,
    Home,
    Info,
    Landmark,
    Layers,
    Lightbulb,
    Loader,
    Loader2,
    LucideProps,
    Menu,
    MessageSquare,
    Network,
    Plus,
    Radio,
    Rocket,
    Scroll,
    Server,
    Settings,
    Shield,
    Sparkles,
    Sprout,
    SquareActivity,
    SquareAsterisk,
    SquareCode,
    SquareLibrary,
    SquareStack,
    SquareTerminal,
    SquareUserRound,
    Trash2,
    TreeDeciduous,
    Users,
    X,
    XCircle,
    Zap
} from 'lucide-react';

const iconMap = {
    AlertCircle,
    BookOpen,
    Bot,
    Castle,
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Compass,
    Computer,
    CreditCard,
    Database,
    Droplets,
    Edit,
    Eye,
    EyeOff,
    FileText,
    Flame,
    HelpCircle,
    History,
    Home,
    Info,
    Landmark,
    Layers,
    Loader,
    Loader2,
    Lightbulb,
    Menu,
    MessageSquare,
    Network,
    Plus,
    Radio,
    Rocket,
    Scroll,
    Server,
    Settings,
    Shield,
    Sparkles,
    Sprout,
    SquareActivity,
    SquareAsterisk,
    SquareCode,
    SquareLibrary,
    SquareStack,
    SquareTerminal,
    SquareUserRound,
    Trash2,
    TreeDeciduous,
    Users,
    X,
    XCircle,
    Zap
} as const;

export type IconName = keyof typeof iconMap;

type IconProps = Omit<LucideProps, 'ref'> & {
    name: IconName;
    className?: string;
};

export default function Icon({
                                 name,
                                 className = '',
                                 size = 20,
                                 strokeWidth = 2,
                                 ...props
                             }: IconProps) {
    const IconComponent = iconMap[name];

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found in whitelist.`);
        return <HelpCircle className={className} size={size} strokeWidth={strokeWidth} {...props} />;
    }

    return <IconComponent className={className} size={size} strokeWidth={strokeWidth} {...props} />;
}
