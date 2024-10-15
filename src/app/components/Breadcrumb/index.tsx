import Link from 'next/link';
import styles from './Breadcrumb.module.scss';

interface BreadcrumbProps {
  title: string;
  url: string;
  current: boolean;
}

export enum BreadcrumbPosition {
  top = 'top',
  bottom = 'bottom',
}

const Breadcrumb = ({
  data,
  position = BreadcrumbPosition.top,
}: {
  data: BreadcrumbProps[];
  position?: BreadcrumbPosition;
}) => {
  return (
    <div className={`${styles.breadcrumb} ${styles[position]}`}>
      <div className={`${styles.breadcrumbInner}`}>
        <ul>
          {data?.map((item: BreadcrumbProps, index: number) => {
            if (!item.current) {
              return (
                <li key={index}>
                  <Link href={item.url}>
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            } else {
              return (
                <li key={index} className={styles.current}>
                  <span>{item.title}</span>
                </li>
              );
            }
          })}
        </ul>
      </div>
    </div>
  );
};

export default Breadcrumb;
