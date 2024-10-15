'use client';
import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { ConfigContext } from '@/context/config.context';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ButtonElement } from '@/types';
import useScrollDirection, { ScrollDown } from '@/hook/useScrollDirection';
import Button from '@/components/Button';
import SvgIcon from '@/components/SvgIcon';
import SubNavGroup from '@/components/Header/Navigation/SubNavGroup';
import scrollLock from 'scroll-lock';
import styles from './Navigation.module.scss';

interface AnimateChangeInHeightProps {
  children: React.ReactNode;
  className?: string;
}

const AnimateChangeInHeight: React.FC<AnimateChangeInHeightProps> = ({ children, className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | 'auto'>('auto');

  const { isNavShow } = useContext(ConfigContext);

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const observedHeight = entries[0].contentRect.height;
        setHeight(observedHeight);
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  return (
    <motion.div
      className={`${styles.subNav} overflow-hidden ${isNavShow ? styles.subNavActive : ''}`}
      style={{ height }}
      animate={{ height }}
      transition={{ duration: 0.3 }}
    >
      <div ref={containerRef} className={`${styles.subNavAniCont}`}>
        {children}
      </div>
    </motion.div>
  );
};

const Navigation = ({
  content,
  highlightCta,
  isHideHeader,
}: {
  content: any;
  highlightCta: ButtonElement<any>[];
  isHideHeader: boolean;
}) => {
  const { slug } = useParams();
  const router = useRouter();
  const [currentSub, setCurrentSub] = useState(0);
  const scrollDirection = useScrollDirection();

  const { isNavShow, setNavShow } = useContext(ConfigContext);

  const openSearchMask = () => {
    setNavShow(false);
  };

  const openNavigation = (index: number) => {
    if (currentSub === index && isNavShow) {
      setNavShow(false);
    } else {
      setCurrentSub(index);
      setNavShow(true);
    }
  };

  const closeNavigation = useCallback(() => {
    setCurrentSub(0);
    setNavShow(false);
  }, [setNavShow]);

  const onFocusHandler = (index: number) => {
    openNavigation(index);
  };

  const onBlurHandler = (index: number) => {
    closeNavigation();
  };

  const onClickRouteLink = (e: any, eid: string, to: string) => {
    e.preventDefault();
    setTimeout(() => router.push(to), 600);
  };

  const onKeydownRouteLink = (e: any, eid: string, to: string) => {
    if (e.key === 'Enter') {
      onClickRouteLink(e, eid, to);
    }
  };

  useEffect(() => {
    if (scrollDirection === ScrollDown) closeNavigation();
  }, [scrollDirection, closeNavigation]);

  useEffect(() => {
    if (isNavShow) {
      scrollLock.disablePageScroll();
    } else {
      scrollLock.enablePageScroll();
    }
  }, [isNavShow]);

  return (
    <nav className={`${styles.nav} ${isHideHeader ? styles.hideHeader : ''}`}>
      <div className={styles.mainNav}>
        <div className={styles.mainNavInner}>
          {content.length &&
            content.map((data: Record<string, any>, index: number) => {
              if (data.sub && Object.keys(data.sub).length > 0) {
                return (
                  <div
                    key={`nav${index}`}
                    className={`${styles.hasSub} ${currentSub == index && isNavShow ? styles.navActive : ''}`}
                  >
                    <button
                      onClick={() => openNavigation(index)}
                      aria-haspopup='true'
                      aria-expanded={isNavShow as boolean}
                      aria-label={data.title}
                    >
                      {data.title}
                      <div className={styles.icon}>
                        <SvgIcon name='arrowDownChevron' />
                      </div>
                    </button>
                  </div>
                );
              } else {
                const path: ButtonElement<any> = {
                  label: data.title,
                  link: {
                    type: data.link.type,
                    href: data.link.href,
                  },
                };

                return <div key={`nav${index}`}>{<Button content={path} className={`${styles.noSub}`} />}</div>;
              }
            })}
        </div>

        <div className={styles.highlightAction}>
          {highlightCta && (
            <div className={styles.highlightCta}>
              {highlightCta.map((item: ButtonElement<any>, index: number) => {
                return <Button key={index} content={item} />;
              })}
            </div>
          )}
        </div>
      </div>
      <AnimateChangeInHeight>
        {content[currentSub].sub && isNavShow && (
          <div className={styles.subNavInner}>
            <button className={styles.subNavClose} onClick={() => closeNavigation()}>
              <div className={styles.icon}>
                <SvgIcon name='close' />
              </div>
            </button>
            <div className={styles.subNavHead}>
              <div className={styles.subNavHeadTitle}>{content[currentSub].title}</div>
              <div className={styles.subNavHeadDescription}>{content[currentSub].description}</div>
            </div>
            <div className={styles.subNavBody}>
              {content[currentSub].sub.map((group: any, gindex: number) => {
                return <SubNavGroup key={`subNav${gindex}`} content={group} />;
              })}
            </div>
          </div>
        )}
      </AnimateChangeInHeight>
    </nav>
  );
};

export default Navigation;
