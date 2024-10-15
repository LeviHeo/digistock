import { Locale } from '@/app/i18n.config';
import type { Metadata, ResolvingMetadata } from 'next';
import { GetPageData, GetPageMeta } from '@/hook/useFetchData';
import { DataTypeProps } from '@/types';
import Breadcrumb, { BreadcrumbPosition } from '@/app/components/Breadcrumb';
import getComponents from '@/hook/useComponents';

const dataType = DataTypeProps.test;

export const generateMetadata = async (
  { params }: { params: { lang: Locale } },
  parent: ResolvingMetadata
): Promise<Metadata> => {
  const { lang } = params;
  return GetPageMeta(dataType, [lang, 'home']);
};

const HomePage = async ({
  params,
  searchParams,
}: {
  params: { lang: Locale; slug: string[] };
  searchParams?: { [key: string]: string };
}) => {
  const { lang } = params;
  const pageData = await GetPageData(dataType, [lang, 'home'], '', searchParams);
  const breadcrumbData = pageData?.breadcrumb || null;

  return (
    <>
      {breadcrumbData && <Breadcrumb data={breadcrumbData} />}
      {getComponents(pageData)}
    </>
  );
};

export default HomePage;
