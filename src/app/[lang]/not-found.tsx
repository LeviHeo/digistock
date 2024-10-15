'use client';
import { useContext } from 'react';
import { useParams } from 'next/navigation';
import Button from '@/components/Button';
import { ConfigContext } from '@/context/config.context';

const NotFound = () => {
  const { lang } = useParams();
  const { dictionary } = useContext(ConfigContext) as any;

  const backToHomeCta = {
    label: 'Back',
    theme: 'outline',
    color: 'black',
    icon: null,
    link: {
      type: 'routeLink',
      href: `/${lang}`,
    },
  };

  return (
    <div className='notFound'>
      <title>{`${dictionary?.error.notFound.title} | ${dictionary?.siteTitle}`}</title>
      <div className='notFoundInner'>
        <h5 className='notFoundTitle'>{dictionary?.error?.notFound?.title}</h5>
        <div
          className={'notFoundDescription richText'}
          dangerouslySetInnerHTML={{
            __html: dictionary?.error?.notFound?.description,
          }}
        />
        <Button content={backToHomeCta} />
      </div>
    </div>
  );
};

export default NotFound;
