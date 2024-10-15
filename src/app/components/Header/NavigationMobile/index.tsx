'use client';
import { useContext, useEffect } from 'react';
import { ConfigContext } from '@/context/config.context';
import SvgIcon from '@/components/SvgIcon';
import styles from './NavigationMobile.module.scss';

const NavigationMobile = () => {
  const { isMobNavShow, setMobNavShow, setMobSubNavShow } = useContext(ConfigContext);

  const openMobNavigation = () => {
    if (isMobNavShow) {
      setMobNavShow(false);
      setMobSubNavShow(false);
    } else {
      setMobNavShow(true);
    }
  };

  useEffect(() => {
    const bodyEl = document.querySelector('body') as HTMLBodyElement;
    if (isMobNavShow) {
      bodyEl.classList.add('overflow-hidden');
    } else {
      bodyEl.classList.remove('overflow-hidden');
    }
  }, [isMobNavShow]);

  return (
    <nav className={`${styles.navMob}`}>
      <button className={styles.btnSearch} onClick={() => openMobNavigation()}>
        <div className={`${styles.icon}`}>
          <SvgIcon name='search' />
        </div>
      </button>
      <button
        className={`${styles.btnToggleNav} ${isMobNavShow ? styles.active : ''}`}
        onClick={() => openMobNavigation()}
      >
        <div></div>
        <div></div>
        <div></div>
      </button>
    </nav>
  );
};

export default NavigationMobile;
