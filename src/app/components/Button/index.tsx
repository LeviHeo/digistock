'use client';
import { useCallback, useContext } from 'react';
import { ConfigContext } from '@/context/config.context';
import { ButtonElement, ButtonAction, ButtonSize, ButtonColor, ButtonIconPosition, ButtonShape } from '@/types';
import { useParams } from 'next/navigation';
import SvgIcon, { IconList } from '@/components/SvgIcon';
import Link from 'next/link';
import styles from './Button.module.scss';

const ButtonIcon = ({ name }: { name: IconList }) => {
  return (
    <div className={`${styles.buttonIconWrap}`}>
      <SvgIcon name={name} />
    </div>
  );
};

const Button = ({
  content,
  size = ButtonSize.md,
  shape = ButtonShape.rectangle,
  className,
  isDisabled = false,
  ref,
  isLoading = false,
}: {
  content: ButtonElement<IconList>;
  size?: ButtonSize;
  shape?: ButtonShape;
  className?: string;
  isDisabled?: boolean;
  ref?: any;
  isLoading?: boolean;
}) => {
  const { label, theme, color, icon, link, callback, callBackData } = content;
  const { lang } = useParams();

  const onClickHandler = () => {
    if (!callback) return;
    callback();
  };

  const onClickHandlerSidePanel = useCallback(() => {
    if (!callBackData) return;
  }, [callBackData]);

  if (!link || !link.type) {
    return <>Empty Link Data</>;
  }

  return (
    <>
      {(link.type === ButtonAction.external ||
        link.type === ButtonAction.routeLink ||
        link.type === ButtonAction.newWindow) && (
        <Link
          href={`${link.href}`}
          className={`${styles.btn} ${styles[lang as string]} ${styles[size]} ${styles[shape]} ${
            styles[color || ButtonColor.red]
          } ${className ? className : ''} ${theme ? styles[theme] : ''} ${icon ? styles.hasIcon : ''} ${
            icon?.position === ButtonIconPosition.left ? styles.iconLeft : styles.iconRight
          } ${isDisabled ? styles.disabled : ''}`}
          target={link.type === ButtonAction.external || link.type === ButtonAction.newWindow ? '_blank' : undefined}
          aria-label={label}
        >
          <span className={styles.btnLabel}>{label}</span>
          {icon && <ButtonIcon name={icon.name} />}
        </Link>
      )}

      {/* {link.type === ButtonAction.external && (
        <button
          className={`${styles.btn} ${styles[lang as string]} ${styles[shape]} ${className ? className : ''} ${theme ? styles[theme] : ''} ${
            icon ? styles.hasIcon : ''
          } ${isDisabled ? styles.disabled : ''} ${styles[color || ButtonColor.red]}`}
          aria-label={label}
        >
          <span className={styles.btnLabel}>{label}</span>
          {icon && <ButtonIcon name={icon.name} />}
        </button>
      )} */}

      {(link.type === ButtonAction.callback || link.type === ButtonAction.sidePanel) && (
        <button
          ref={ref}
          className={`${styles.btn} ${styles[lang as string]} ${styles[size]} ${styles[shape]} ${
            styles[color || ButtonColor.red]
          } ${className ? className : ''} ${theme ? styles[theme] : ''} ${icon ? styles.hasIcon : ''} ${
            icon?.position === ButtonIconPosition.left ? styles.iconLeft : styles.iconRight
          } ${isDisabled ? styles.disabled : ''}`}
          onClick={(e) => {
            e.preventDefault();

            if (link.type === ButtonAction.callback) {
              onClickHandler();
            }

            if (link.type === ButtonAction.sidePanel) {
              onClickHandlerSidePanel();
            }
          }}
          aria-label={label}
        >
          <span className={styles.btnLabel}>{label}</span>
          {icon && <ButtonIcon name={icon.name} />}
        </button>
      )}

      {link.type === ButtonAction.submit && (
        <button
          className={`${styles.btn} ${styles[lang as string]} ${className ? className : ''} ${styles[size]} ${
            styles[shape]
          } ${styles[color || ButtonColor.red]} ${theme ? styles[theme] : ''} ${icon ? styles.hasIcon : ''} ${
            isDisabled || isLoading ? styles.disabled : ''
          }`}
          onClick={() => {
            onClickHandler();
          }}
          aria-label={label}
          type='submit'
        >
          {isLoading ? (
            <span>Loading...</span>
          ) : (
            <>
              <span className={styles.btnLabel}>{label}</span>
              {icon && <ButtonIcon name={icon.name} />}
            </>
          )}
        </button>
      )}
    </>
  );
};

export default Button;
