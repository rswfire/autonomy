// components/Icon.tsx
import {
    ChevronDown,
    ChevronUp,
    Compass,
    FileText,
    HelpCircle,
    Layers,
    Lock,
    LucideProps,
    Mail,
    Menu,
    Mic,
    Network,
    ShieldCheck,
    TreeDeciduous,
    Video,
    X
} from 'lucide-react';

const iconMap = {
    ChevronDown,
    ChevronUp,
    FileText,
    HelpCircle,
    Mail,
    Menu,
    Mic,
    TreeDeciduous,
    Video,
    X,
    Compass,      // Explore
    ShieldCheck,  // Proof (verification without aggression)
    Layers,       // Work / Systems
    Network,      // Network (if you want literal clarity)
    Lock,         // Client Dashboard / gated system
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
