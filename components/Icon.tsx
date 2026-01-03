// components/Icon.tsx
import {
    ChevronRight,
    Compass,
    FlaskConical,
    HelpCircle,
    Home,
    LucideProps,
    Plus,
    Settings,
    SquareActivity,
    SquareCode,
    Users,
} from 'lucide-react';

const iconMap = {
    ChevronRight,
    Compass,
    FlaskConical,
    HelpCircle,
    Home,
    Plus,
    Settings,
    SquareActivity,
    SquareCode,
    Users,
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
