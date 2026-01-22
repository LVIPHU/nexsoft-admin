import { IconsMap } from '@/icons/map';

type IconProps = {
  name: keyof typeof IconsMap;
  className?: string;
  fillCurrentColor?: boolean;
};

export function Icon({ name, className, fillCurrentColor }: IconProps) {
  const Icon = IconsMap[name];

  if (!Icon) return null;

  return <Icon className={className} fill={fillCurrentColor ? 'currentColor' : 'none'} aria-hidden focusable={false} />;
}
