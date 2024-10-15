'use client';
import { ButtonElement, ButtonShape } from '@/types';
import { IconList } from '@/components/SvgIcon';
import Button from '@/components/Button';
import styles from './ConerButton.module.scss';

const CornerButton = ({ content }: { content: ButtonElement<IconList> }) => {
  return (
    <div className={`${styles.conerButton}`}>
      <div className={`${styles.inner}`}>
        <div className={`${styles.btn}`}>
          <Button content={content} shape={ButtonShape.cirlce} />
        </div>
        <div className={`${styles.coner}`}>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 91.58 88' fill='#ffffff'>
            <path d='m71.58,20h-11.58c-22.09,0-40,17.91-40,40v8c0,11.05-8.95,20-20,20h91.58V0c0,11.05-8.95,20-20,20Z' />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CornerButton;
