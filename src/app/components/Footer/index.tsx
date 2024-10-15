'use client';
import { memo } from 'react';
import { ButtonElementDefault } from '@/types';
import { Accordion, AccordionItem } from '@nextui-org/react';
import Button from '@/components/Button';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.scss';
import SvgIcon from '@/components/SvgIcon';

interface FooterDataProps {
  logo: {
    src: {
      desktop: string;
      mobile: string;
    };
  };
  navigation: {
    footer: {
      title: string;
      items: ButtonElementDefault[];
    }[];
    footerQuickMenu: ButtonElementDefault[];
  };
  dictionary: Record<string, any>;
  iframe?: string;
}

const Footer = ({ content }: { content: FooterDataProps }) => {
  const {
    logo,
    navigation: { footer, footerQuickMenu },
    dictionary,
  } = content;

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerFeature}>
            {footer && (
              <div className={`${styles.footerMenuMobile}`}>
                <Accordion showDivider={false}>
                  {footer.map(({ title, items }: { title: string; items: ButtonElementDefault[] }, index: number) => {
                    return (
                      <AccordionItem
                        key={index}
                        title={title}
                        indicator={
                          <div className={`${styles.indicatorIcon}`}>
                            <SvgIcon name='arrowDownChevron' />
                          </div>
                        }
                        className={styles.footerMenuGroup}
                        classNames={{
                          indicator: styles.indicator,
                          title: styles.groupLabel,
                        }}
                      >
                        <div className={styles.groupItems}>
                          {items?.map((item: ButtonElementDefault, nindex: number) => {
                            return <Button content={item} key={nindex} className={styles.footerMenuItem} />;
                          })}
                        </div>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            )}
          </div>

          {footer && (
            <div className={`${styles.footerMenuDesktop}`}>
              {footer.map(({ title, items }: { title: string; items: ButtonElementDefault[] }, index: number) => {
                return (
                  <div className={styles.footerMenuGroup} key={index}>
                    <div className={styles.groupLabel}>{title}</div>
                    <div className={styles.groupItems}>
                      {items?.map((item: ButtonElementDefault, nindex: number) => {
                        return <Button content={item} key={nindex} className={styles.footerMenuItem} />;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className={styles.footerOtherContent}>
            <div className={styles.footerLogo}>
              {logo && (
                <Link
                  className={styles.logo}
                  href={`/`}
                  title={dictionary?.siteTitle}
                  aria-label={dictionary?.siteTitle}
                >
                  <Image src={logo.src.desktop} width={148} height={47} alt={dictionary?.siteTitle} />
                </Link>
              )}
            </div>
            <div className={styles.footerQuickMenu}>
              {footerQuickMenu && (
                <nav className={styles.quickMenuList}>
                  <ul>
                    {footerQuickMenu.map((item: ButtonElementDefault, index: number) => {
                      return (
                        <li key={index}>
                          <Button content={item} className={styles.footerQuickMenuItem} />
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              )}
              <div className={styles.copyright} dangerouslySetInnerHTML={{ __html: dictionary?.copyright }} />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default memo(Footer);
