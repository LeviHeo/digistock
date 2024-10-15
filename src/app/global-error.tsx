'use client';
import { useContext } from 'react';
import { useParams } from 'next/navigation';
import Button from '@/components/Button';
import { ConfigContext } from '@/context/config.context';

const GlobalError = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  const { lang } = useParams();
  const { dictionary } = useContext(ConfigContext) as any;

  const backToHomeCta = {
    label: dictionary?.button?.visitOurHome,
    theme: 'outline',
    color: 'black',
    icon: null,
    link: {
      type: 'callback',
      href: ``,
    },
    callback: () => {
      reset();
    },
  };

  return (
    <html lang='en-US'>
      <title>{`Internal Server Error | ${dictionary?.siteTitle}`}</title>
      <body>
        <div className='notFound'>
          <div className='notFoundInner'>
            <h5 className='notFoundTitle'>Something went wrong!</h5>
            <div
              className={'notFoundDescription richText'}
              dangerouslySetInnerHTML={{
                __html: dictionary?.error?.notFound?.description,
              }}
            />
            <Button content={backToHomeCta} />
          </div>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
