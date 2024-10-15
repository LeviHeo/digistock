'use client';
import { useContext } from 'react';
import { ConfigContext } from '@/context/config.context';
import styles from './PageWrapper.module.scss';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isImportantNoticeShow, isMobHighlightCtaShow, hasImportantNotice, giftCartData } = useContext(
    ConfigContext
  ) as any;

  return (
    <main
      id='page-main-content'
      className={`${styles.pageWrapper} ${hasImportantNotice ? styles.hasImportantNotice : ''} ${isImportantNoticeShow ? styles.showNoticeDetail : ''} ${isMobHighlightCtaShow ? styles.showMobHighlightCta : ''}`}
    >
      {children}
    </main>
  );
};

export default PageWrapper;
