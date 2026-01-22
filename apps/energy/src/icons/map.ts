import type { FC, SVGProps } from 'react';
import * as Icons from './index';

export type IconComponent = FC<SVGProps<SVGSVGElement>>;

export const IconsMap = Icons satisfies Record<string, IconComponent>;
