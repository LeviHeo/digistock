'use client';
import { type SVGProps } from 'react';
import { type IconList } from '@/types/icons';
import styles from './SvgIcon.module.scss';

export { IconList };

const SvgIcon = ({
  name,
  isColor,
  childClassName,
  className,
  children,
  ...props
}: SVGProps<HTMLDivElement> & {
  name: IconList;
  isColor?: boolean;
  childClassName?: string;
}) => {
  if (children) {
    return (
      <div className={`${styles.svgIconWrap}`} {...props}>
        <SvgIcon name={name} className={className} {...props} />
        {children}
      </div>
    );
  }
  return (
    <i
      className={`${styles.svgIcon} svgIcon-${name} ${styles[`svgIcon-${isColor ? 'color' : 'monochrome'}`]}`}
      {...props}
    >
      <span
        style={
          isColor
            ? {
                ['backgroundImage' as any]: `url('/assets/img/sprite.svg#${name}')`,
              }
            : {
                ['maskImage' as any]: `url('/assets/img/sprite.svg#${name}')`,
                ['WebkitMaskImage' as any]: `url('/assets/img/sprite.svg#${name}')`,
              }
        }
      ></span>
    </i>
  );
};

export default SvgIcon;
