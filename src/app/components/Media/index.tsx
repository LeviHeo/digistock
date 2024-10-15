'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MediaFormat, type MediaElement } from '@/types';
import Cookies from 'js-cookie';
import Image from 'next/image';
import styles from './Media.module.scss';

interface Props {
  content: MediaElement;
  isPlay?: boolean;
  isSlider?: boolean;
  isCard?: boolean;
}

const Media = ({ content, isPlay, isSlider, isCard }: Props) => {
  const media = content;
  const videoEl = useRef<any>(null);

  const getObjectLength = (obj: any) => {
    let count = 0;
    for (let key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] !== null) {
        count++;
      }
    }
    return count;
  };

  const mediaLength = getObjectLength(media?.src);

  const [isFinishedIntro, setIsFinishedIntro] = useState(false);

  const checkIntroCookie = useCallback(() => {
    const finishedIntroCookie = Cookies.get('_fli');
    if (!finishedIntroCookie) return;
    if (finishedIntroCookie) {
      setIsFinishedIntro(true);
      return true;
    }
    return false;
  }, [setIsFinishedIntro]);

  const totalCount = 20;

  useEffect(() => {
    if (videoEl.current) {
      videoEl.current.muted = true;

      let interval: NodeJS.Timeout;
      let count = 0;

      if (isPlay) {
        const intro = checkIntroCookie();
        if (intro) {
          videoEl.current.play();
        } else {
          interval = setInterval(() => {
            count++;
            const intro = checkIntroCookie();
            if (intro) {
              if (isPlay) videoEl.current.play();
              clearInterval(interval);
            }
            if (count >= totalCount) clearInterval(interval);
          }, 500);
        }
      } else {
        videoEl.current.pause();
      }

      return () => clearInterval(interval);
    }
  }, [isPlay, checkIntroCookie]);

  if (!media) return <p className='text-[20px] p-10'>No Image uploaded and found</p>;

  return (
    <figure className={`${isSlider && styles['slider']} ${isCard && styles['card']}`}>
      {media.type === MediaFormat.image && mediaLength > 1 && (
        <>
          {Object.entries(media.src).map(([key, value], index) => {
            const resKey = key.charAt(0).toUpperCase() + key.slice(1);
            return (
              <Image
                key={`media${resKey}`}
                src={value}
                alt={media.alt || ''}
                className={`display${resKey}`}
                fill
                style={{ objectFit: 'cover' }}
                loading='lazy'
                sizes='(max-width: 100px) 100%'
              />
            );
          })}
        </>
      )}

      {media.type === MediaFormat.image && mediaLength < 2 && (
        <Image
          src={media.src.desktop}
          alt={media.alt || ''}
          fill
          style={{ objectFit: 'cover' }}
          loading='lazy'
          sizes='(max-width: 100px) 100%'
        />
      )}

      {media.type === MediaFormat.video && (
        <video ref={videoEl} className={styles.videoCont} loop playsInline muted controls={false}>
          <source src={media.src.desktop} type='video/mp4' />
          <track default kind='captions'></track>
        </video>
      )}
      {media.alt && <figcaption className='blind'>{media.alt}</figcaption>}
    </figure>
  );
};

export default Media;
