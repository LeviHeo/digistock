'use client';
import {
  ButtonAction,
  type ButtonElement,
  type ButtonElementDefault,
  type ButtonLinkElement,
  type MediaElement,
} from '@/types';
import { IconList } from '@/types/icons';
import Button from '@/components/Button';
import Media from '@/components/Media';
import styles from './SubNavGroup.module.scss';
import Link from 'next/link';

enum SubNavLayout {
  list = 'list',
  card = 'card',
}

interface LayoutCard {
  title: string;
  description: string;
  media: MediaElement;
  cta: ButtonElement<IconList>[];
}

interface LayoutList extends ButtonElementDefault {}

interface SubNavGroupProps {
  layout: SubNavLayout;
  title: string;
  url?: ButtonLinkElement;
  items: [];
}

const SubNavGroup = ({ content }: { content: SubNavGroupProps }) => {
  const { layout, title, url, items } = content;

  return (
    <div className={styles.subNavGroup}>
      {url ? (
        <Link
          href={url.href}
          target={url.type === ButtonAction.newWindow ? '_blank' : undefined}
          className={styles.subNavGroupTitle}
        >
          {title}
        </Link>
      ) : (
        <div className={styles.subNavGroupTitle}>{title}</div>
      )}
      {layout === SubNavLayout.list && (
        <>
          <div className={styles.subNavGroupBody}>
            {items?.map((subNav: LayoutList, sIndex: number) => {
              return <Button content={subNav} key={`subNav${sIndex}`} className={styles.subNavItem} />;
            })}
          </div>
        </>
      )}

      {layout === SubNavLayout.card && (
        <>
          <div className={styles.subNavGroupBody}>
            {items?.map((subNav: LayoutCard, sIndex: number) => {
              return (
                <div key={`subNav${sIndex}`} className={`${styles.subNavCard}`}>
                  {subNav.media && (
                    <div className={`${styles.thumb}`}>
                      <Media content={subNav.media} />
                    </div>
                  )}
                  {subNav.title && <div className={`${styles.title}`}> {subNav.title}</div>}
                  {subNav.description && <div className={`${styles.description}`}> {subNav.description}</div>}
                  {subNav.cta && (
                    <div className={`${styles.actions}`}>
                      {subNav.cta.map((cta: ButtonElement<any>, index: number) => {
                        return <Button key={index} content={cta} />;
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default SubNavGroup;
