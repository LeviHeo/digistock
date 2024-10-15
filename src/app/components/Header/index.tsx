'use client';
import { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { ConfigContext } from '@/context/config.context';
import { useParams, usePathname } from 'next/navigation';
import { ButtonElement, ButtonAction, ButtonIconPosition, ButtonVariantion, ButtonElementDefault } from '@/types';
import useScrollDirection, { ScrollDown } from '@/hook/useScrollDirection';
import { KeyDown } from '@/hook/useKeyDown';
import { SetBreakPoint } from '@/hook/useBreakPoint';
import Navigation from '@/components/Header/Navigation';
import NavigationMobile from '@/components/Header/NavigationMobile';
import NavigationMobileDropdown from '@/components/Header/NavigationMobileDropdown';
import { motion } from 'framer-motion';
import Button from '@/components/Button';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.scss';

export interface globalDataProps {
  logo: {
    src: {
      desktop: string;
      mobile: string;
    };
  };
  navigation: {
    header: Record<string, any>[];
    highlightCta: ButtonElement<any>[];
    noticeBar: {
      quickMenu: ButtonElementDefault[];
    };
    footer: {
      title: string;
      items: ButtonElementDefault[];
    }[];
    footerQuickMenu: ButtonElementDefault[];
  };
  dictionary: Record<string, any>;
}

const Header = ({ content }: { content: globalDataProps }) => {
  const { slug, lang } = useParams();
  SetBreakPoint();
  const {
    logo,
    navigation: {
      header,
      highlightCta,
      noticeBar: { quickMenu },
    },
    dictionary,
  } = content;

  const {
    isNavShow,
    setNavShow,
    isMobSubNavShow,
    setMobSubNavShow,
    isMobNavShow,
    setMobNavShow,
    setDictionary,
    setLanguages,
    isMobHighlightCtaShow,
    setMobHighlightCtaShow,
    showHeader,
  } = useContext(ConfigContext);

  const languages = useMemo(() => {
    return {
      en: {
        short: 'EN',
        full: 'English',
      },
      'zh-hant': {
        short: '中文',
        full: '中文',
      },
    };
  }, []);

  useEffect(() => {
    setDictionary(dictionary);
    setLanguages(languages);
  }, [content, dictionary, languages, setDictionary, setLanguages]);

  const scrollDirection = useScrollDirection();
  const [y, setY] = useState(0);
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const handleNavTheme = () => {
      setY(window.scrollY);
      if (window.scrollY > 100) {
        setIsTop(false);
      } else {
        setIsTop(true);
      }
    };

    window.addEventListener('scroll', handleNavTheme);
    return () => {
      window.removeEventListener('scroll', handleNavTheme);
    };
  }, [y, scrollDirection, setIsTop]);

  const closeAll = useCallback((): void => {
    setNavShow(false);
    setMobNavShow(false);
    setMobSubNavShow(false);
  }, [setNavShow, setMobNavShow, setMobSubNavShow]);
  KeyDown('Escape', closeAll);

  const pathname = usePathname();

  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

  const searchCta: ButtonElement<any> = {
    label: dictionary.button.search || 'Search',
    theme: ButtonVariantion.default,
    icon: {
      name: 'search',
      position: ButtonIconPosition.left,
    },
    link: {
      type: ButtonAction.callback,
      href: '',
    },
    callback: () => {
      console.log('click search');
    },
  };

  return (
    <header
      className={`${styles.header} ${
        !showHeader ? styles['fullyHideHeader'] : scrollDirection === ScrollDown ? styles.hideHeader : ''
      } ${isMobHighlightCtaShow ? styles.showMobHighlightCta : ''} ${isTop ? styles.posTop : ''}`}
    >
      <div className={styles.quickMenu}>
        <div className={styles.quickMenuInner}>
          <div className={styles.quickMenuActions}>
            {quickMenu &&
              quickMenu.map((item: ButtonElement<any>, index: number) => {
                return <Button key={index} content={item} className={styles.quickMenuItem} />;
              })}
            <Button content={searchCta} className={styles.quickMenuItem} />
          </div>
        </div>
      </div>
      <div className={styles.headerInner}>
        <Link
          className={styles.logo}
          href={`/${lang}`}
          title={dictionary?.siteTitle}
          aria-label={dictionary?.siteTitle}
        >
          <Image src={logo.src.desktop} width={200} height={56} alt={dictionary?.siteTitle} />
        </Link>
        <div className={styles.navContainer}>
          <Navigation
            content={header}
            highlightCta={highlightCta}
            isHideHeader={scrollDirection === ScrollDown ? true : false}
          />
          <NavigationMobile />
        </div>
      </div>
      {highlightCta && isMobHighlightCtaShow && (
        <div className={`${styles.highlightCtaMob}`}>
          {highlightCta && (
            <div className={styles.highlightCta}>
              {highlightCta.map((item: ButtonElement<any>, index: number) => {
                return <Button key={index} content={item} className={styles.square} />;
              })}
            </div>
          )}
        </div>
      )}
      <NavigationMobileDropdown content={content} isHideHeader={scrollDirection === ScrollDown ? true : false} />
    </header>
  );
};

export default Header;
