import { notFound } from 'next/navigation';
import { i18n, HrefLangType } from '@/app/i18n.config';
import { headers, cookies } from 'next/headers';
import { DataTypeProps } from '@/types';

const { NEXT_PUBLIC_DEV_API_ENDPOINT_SUFFIXE, NEXT_PUBLIC_DEV_LOCAL_API_ENDPOINT, NEXT_PUBLIC_DEV_PREV_API_ENDPOINT } =
  process.env;

const endpointPrefixList = {
  test: NEXT_PUBLIC_DEV_API_ENDPOINT_SUFFIXE,
};

const exceptionCase = (slug: string[]) => {
  if (/api|assets|favicon.ico|sw.js|turbopack|__nextjs_original-stack-frame/.test(slug[0]) || slug === undefined) {
    return true;
  }
  return;
};

const objectToQueryString = (obj: Record<string, string>) => {
  const keys = Object.keys(obj);
  const keyValuePairs = keys.map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
  });
  return keyValuePairs.join('&');
};

export const GetPageData = async (
  dataType: DataTypeProps,
  slug: string[],
  from?: string,
  searchParams?: Record<string, string>
) => {
  if (exceptionCase(slug)) return;

  const endpoint = `${endpointPrefixList[dataType as keyof typeof endpointPrefixList]}/${slug.join('/')}.json`;
  try {
    const response = await fetch(
      `${
        process.env.NODE_ENV === 'production' ? NEXT_PUBLIC_DEV_PREV_API_ENDPOINT : NEXT_PUBLIC_DEV_LOCAL_API_ENDPOINT
      }${endpoint}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(
      `==== TEST DATA NOT FOUND (${
        process.env.NODE_ENV === 'production' ? NEXT_PUBLIC_DEV_PREV_API_ENDPOINT : NEXT_PUBLIC_DEV_LOCAL_API_ENDPOINT
      }${endpoint}) ====`
    );
    console.error(error);
    return notFound();
  }
};

export const GetPageMeta = async (dataType: DataTypeProps, slug: string[]) => {
  if (exceptionCase(slug)) {
    return {
      title: null,
    };
  } else {
    try {
      const data = await GetPageData(dataType, slug, 'Get Meta');
      const {
        meta: { title, description, keywords, ogImage: images },
      } = data;

      const headersList = headers();
      const pathname = headersList.get('x-forwarded-pathname');

      const getLanguages = () => {
        const locales: any = {};
        for (let i = 0; i < i18n.locales.length; i++) {
          locales[i18n.locales[i]] = `/${i18n.locales[i]}`;
        }
        return locales;
      };

      return {
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_ENDPOINT as string),
        title,
        description,
        keywords,
        alternates: {
          canonical: `/${slug.join('/')}`,
          languages: getLanguages(),
        },
        openGraph: {
          title,
          description,
          images,
          type: `website`,
          url: `${pathname}`,
        },
      };
    } catch (error) {
      console.log('Meta data not found');
      return notFound();
    }
  }
};
