// components/Icon.tsx
import {
    BookOpen,
    Bot,
    Castle,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Compass,
    Computer,
    CreditCard,
    Database,
    Droplets,
    Edit,
    Eye,
    EyeOff,
    Flame,
    HelpCircle,
    Home,
    Info,
    Landmark,
    Lightbulb,
    Loader2,
    LucideProps,
    Menu,
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
    X
} from 'lucide-react';

const iconMap = {
    BookOpen,
    Bot,
    Castle,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Compass,
    Computer,
    CreditCard,
    Database,
    Droplets,
    Edit,
    Eye,
    EyeOff,
    Flame,
    HelpCircle,
    Home,
    Info,
    Landmark,
    Loader2,
    Lightbulb,
    Menu,
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
