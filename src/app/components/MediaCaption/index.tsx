'use client';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SvgIcon from '@/components/SvgIcon';
import styles from './MediaCaption.module.scss';

const MediaCaption = ({
  data,
  className,
  onChange,
}: {
  data: any;
  className?: string;
  onChange?: (e: boolean) => void;
}) => {
  const [isOpen, setOpen] = useState(false);

  const onClickHandler = useCallback(() => {
    setOpen(!isOpen);
    if (!onChange) return;
    onChange(!isOpen);
  }, [setOpen, isOpen, onChange]);

  return (
    <>
      <button
        onClick={() => onClickHandler()}
        className={`${styles.informationIcon} ${isOpen ? styles.active : ''} ${className ? className : ''}`}
        aria-label={`${data?.title || 'Information'}`}
      >
        <div className={`${styles.icon}`}>{isOpen ? <SvgIcon name='close' /> : <SvgIcon name='information' />}</div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.figcaption
            className={`${styles.caption}`}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className={`${styles.captionInner}`}>
              <div className={`${styles.captionContent} richText`} dangerouslySetInnerHTML={{ __html: data }} />
            </div>
          </motion.figcaption>
        )}
      </AnimatePresence>
    </>
  );
};

export default MediaCaption;
