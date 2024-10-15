import type { Viewport } from 'next';
import { Locale } from '@/app/i18n.config';
import { ConfigContextProvider } from '@/context/config.context';
import { GetPageData } from '@/hook/useFetchData';
import { DataTypeProps } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PopupMask from '@/components/PopupMask';
import PageWrapper from '@/components/PageWrapper';
import '@/styles/global.scss';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const RootLayout = async ({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: {
    lang: Locale;
  };
}) => {
  const commonData = await GetPageData(
    process.env.NEXT_PUBLIC_DATA_TYPE === 'data' ? DataTypeProps.data : DataTypeProps.test,
    [lang, 'global']
  );

  return (
    <html lang={lang}>
      {commonData && (
        <>
          <link rel='icon' href={commonData.favIcon} sizes='any' />
          <body>
            <ConfigContextProvider>
              <Header content={commonData} />
              <PageWrapper>{children}</PageWrapper>
              <Footer content={commonData} />
              <PopupMask />
            </ConfigContextProvider>
          </body>
        </>
      )}
    </html>
  );
};

export default RootLayout;
