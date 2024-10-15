'use client';
import { MediaElement, Module } from '@/types';
import styles from './Logo.module.scss';
import Image from 'next/image';
import { MatchMedia, ScreenList } from '@/hook/useBreakPoint';

type Size = '3' | '5' | '6' | '8';

interface LogoProps {
  title: string;
  logos: {
    category: string;
    size: Size;
    items: MediaElement[];
  }[];
}

const Logo = ({ data }: { data: Module<LogoProps, null> }) => {
  const {
    content: { title, logos },
  } = data;

  const cols = {
    3: styles.three,
    5: styles.five,
    6: styles.six,
    8: styles.eight,
  };

  const getRowItems = (size: string, items: MediaElement[]) => {
    const rowSize: Record<string, number> = {
      3: 3,
      5: MatchMedia(ScreenList.lg) ? 3 : 5,
      6: MatchMedia(ScreenList.lg) ? 4 : 6,
      8: MatchMedia(ScreenList.lg) ? 4 : 8,
    };

    const SIZE = rowSize[size];
    const rows = Math.ceil(items.length / SIZE);
    const rowItems = [];
    let start = 0;
    let end = SIZE;
    for (let i = 0; i < rows; i++) {
      rowItems.push(items.slice(start, end));
      start += SIZE;
      end += SIZE;
    }
    return rowItems;
  };

  return (
    <section className={`${styles.logoContainer} sectionTopConerRound`}>
      <h3 className={styles.title}>{title}</h3>

      {logos?.map((item, index) => {
        return (
          <div key={index} className={styles.logoRow}>
            <p className={styles.category}>{item.category}</p>

            {getRowItems(item.size, item.items)?.map((logos, index) => {
              return (
                <div key={index} className={styles.row}>
                  {logos?.map((logo, index) => {
                    return (
                      <div key={index} className={`${styles.imgWrapper} ${cols[item.size]}`}>
                        <Image
                          src={logo?.src?.desktop}
                          alt={logo?.alt || ''}
                          width='0'
                          height='0'
                          sizes='100vw'
                          priority={true}
                          className={styles.img}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </section>
  );
};

export default Logo;
