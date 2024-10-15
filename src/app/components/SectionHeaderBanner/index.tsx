'use client';
import { MediaElement, Module } from '@/types';
import MediaCaption from '../MediaCaption';
import styles from './SectionHeaderBanner.module.scss';
import Image from 'next/image';
import { MatchMedia, ScreenList } from '@/hook/useBreakPoint';

enum BannerSize {
  small = 'small',
  large = 'large',
}

interface SectionHeaderBannerOption {
  isBannerSize: BannerSize;
}

interface SectionHeaderBannerProps {
  media: MediaElement;
  title: string;
  description?: string;
}

const SectionHeaderBanner = ({ data }: { data: Module<SectionHeaderBannerProps, SectionHeaderBannerOption> }) => {
  const { media, title, description } = data.content;
  const { isBannerSize } = data.moduleOption || {};

  return (
    <section className={`${styles.sectionHeaderBanner} ${isBannerSize ? styles[isBannerSize] : styles.large}`}>
      <div className={styles.moduleInner}>
        {media && (
          <div className={styles.imgWrapper}>
            <Image
              src={
                MatchMedia(ScreenList.lg)
                  ? media?.src?.mobile
                    ? media?.src?.mobile
                    : media?.src?.desktop
                  : media?.src?.desktop
              }
              alt={media?.alt || ''}
              width='0'
              height='0'
              sizes='100vw'
              priority={true}
              className={styles.img}
            />
          </div>
        )}

        <div className={styles.content}>
          <div className={styles.contentWrapper}>
            {title?.trim() && (
              <h1 className={`${styles.title} richTitle`} dangerouslySetInnerHTML={{ __html: title }} />
            )}
            {description?.trim() && (
              <div className={`${styles.description} richText`} dangerouslySetInnerHTML={{ __html: description }} />
            )}
          </div>
        </div>
      </div>

      {media?.mediaCaption && <MediaCaption data={media?.mediaCaption} className={styles.mediaCaption} />}
    </section>
  );
};

export default SectionHeaderBanner;
