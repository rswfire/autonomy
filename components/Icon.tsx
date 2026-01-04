// components/Icon.tsx
import {
    BookOpen,
    Castle,
    ChevronLeft,
    ChevronRight,
    Compass,
    Database,
    Droplets,
    Flame,
    HelpCircle,
    Home,
    Lightbulb,
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
    SquareActivity,
    SquareAsterisk,
    SquareCode,
    SquareLibrary,
    SquareStack,
    SquareTerminal,
    SquareUserRound,
    TreeDeciduous,
    Users,
    X
} from 'lucide-react';

const iconMap = {
    BookOpen,
    Castle,
    ChevronLeft,
    ChevronRight,
    Compass,
    Database,
    Droplets,
    Flame,
    HelpCircle,
    Home,
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
    SquareActivity,
    SquareAsterisk,
    SquareCode,
    SquareLibrary,
    SquareStack,
    SquareTerminal,
    SquareUserRound,
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
