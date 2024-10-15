'use client';
import { useState, useContext, useCallback, useEffect } from 'react';
import { ConfigContext } from '@/context/config.context';
import SubNavGroup from '@/components/Header/Navigation/SubNavGroup';
import SvgIcon from '@/components/SvgIcon';
import { ButtonElement, ButtonVariantion, ButtonColor, ButtonIconPosition, ButtonAction } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/Button';
import { usePathname, useSearchParams } from 'next/navigation';
import styles from './NavigationMobileDropdown.module.scss';

const NavigationMobileDropdown = ({ content, isHideHeader }: { content: any; isHideHeader: boolean }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { dictionary } = useContext(ConfigContext) as any;
  const { isMobNavShow, isMobSubNavShow, setMobNavShow, setMobSubNavShow, isMobHighlightCtaShow } =
    useContext(ConfigContext);
  const [currentSub, setCurrentSub] = useState(0);

  const {
    navigation: {
      header,
      noticeBar: { quickMenu },
    },
  } = content;

  useEffect(() => {
    setMobNavShow(false);
  }, [pathname, searchParams]);

  const openSubNavigation = (index: number) => {
    if (currentSub === index && isMobSubNavShow) {
      setMobSubNavShow(false);
    } else {
      setCurrentSub(index);
      setMobSubNavShow(true);
    }
  };

  const closeSubNavigation = useCallback(() => {
    setCurrentSub(0);
    setMobSubNavShow(false);
  }, [setMobSubNavShow]);

  const btnBack: ButtonElement<any> = {
    label: dictionary?.button.back,
    theme: ButtonVariantion.secondary,
    color: ButtonColor.black,
    icon: {
      name: 'arrowLeft',
      position: ButtonIconPosition.left,
    },
    link: {
      type: ButtonAction.callback,
      href: '',
    },
    callback: () => closeSubNavigation(),
  };

  return (
    <AnimatePresence>
      {isMobNavShow && (
        <motion.div
          className={`${styles.mobNavDropdown} ${isHideHeader ? styles.hideHeader : ''} ${
            isMobHighlightCtaShow ? styles.showMobHighlightCta : ''
          }`}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className={`${styles.mobNavDropdownInner}`}>
            <div className={`${styles.body}`}>
              <div className={`${styles.bodyInner}`}>
                <nav className={styles.mobNavList}>
                  {header.length &&
                    header.map((data: Record<string, any>, index: number) => {
                      if (data.sub && Object.keys(data.sub).length > 0) {
                        return (
                          <div key={`nav${index}`} className={`${styles.mobNavItem} ${styles.hasSub}`}>
                            <button
                              onClick={() => openSubNavigation(index)}
                              aria-haspopup='true'
                              aria-expanded={isMobSubNavShow as boolean}
                              aria-label={data.title}
                            >
                              <span>{data.title}</span>
                              <div className={styles.btnIcon}>
                                <div className={styles.icon}>
                                  <SvgIcon name='arrowRight' />
                                </div>
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

                        return (
                          <div key={`nav${index}`}>{<Button content={path} className={`${styles.mobNavItem}`} />}</div>
                        );
                      }
                    })}
                </nav>

                <div className={styles.quickMenu}>
                  <div className={styles.quickMenuActions}>
                    {quickMenu &&
                      quickMenu.map((item: ButtonElement<any>, index: number) => {
                        return <Button key={index} content={item} className={styles.quickMenuItem} />;
                      })}
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles.footer}`}>
              <div className={`${styles.footerInner}`}>{/* Placeholder */}</div>
            </div>
            <AnimatePresence>
              {isMobSubNavShow && (
                <motion.div
                  className={`${styles.mobSubNav}`}
                  key={'fadeRightInOut'}
                  exit={{ x: '100%' }}
                  initial={{ x: '100%' }}
                  animate={{ x: '0%' }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  <div className={`${styles.mobSubNavInner}`}>
                    <div className={`${styles.mobSubClose}`}>
                      <Button content={btnBack} className={styles.btnClose} />
                    </div>
                    <div className={`${styles.mobSubBody}`}>
                      {header[currentSub].title && (
                        <div className={`${styles.bodyGroup}`}>
                          <div className={`${styles.bodyGroupInner}`}>
                            <div className={styles.subNavHead}>
                              <div className={styles.subNavHeadTitle}>{header[currentSub].title}</div>
                              <div className={styles.subNavHeadDescription}>{header[currentSub].description}</div>
                            </div>
                          </div>
                        </div>
                      )}
                      {header[currentSub].sub &&
                        header[currentSub].sub.map((group: any, gindex: number) => {
                          return (
                            <div key={`subNav${gindex}`} className={`${styles.bodyGroup}`}>
                              <div className={`${styles.bodyGroupInner}`}>
                                <SubNavGroup content={group} />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavigationMobileDropdown;
