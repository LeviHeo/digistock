import { Locale } from '@/app/i18n.config';
import type { Metadata, ResolvingMetadata } from 'next';
import { GetPageData, GetPageMeta } from '@/hook/useFetchData';
import { DataTypeProps } from '@/types';
import Breadcrumb, { BreadcrumbPosition } from '@/app/components/Breadcrumb';
import getComponents from '@/hook/useComponents';

const dataType = DataTypeProps.test;

export const generateMetadata = async (
  { params }: { params: { lang: Locale; slug: string[] } },
  parent: ResolvingMetadata
): Promise<Metadata> => {
  const { lang, slug } = params;
  return GetPageMeta(dataType, [lang, ...slug]);
};

const DynamicPage = async ({
  params,
  searchParams,
}: {
  params: { lang: Locale; slug: string[] };
  searchParams?: { [key: string]: string };
}) => {
  const { lang, slug } = params;
  const pageData = await GetPageData(dataType, [lang, ...slug], '', searchParams);
  const isShowProgress = pageData?.pageOption?.isShowProgress || false;
  const breadcrumbData = pageData?.breadcrumb || null;

  return (
    <>
      {breadcrumbData && <Breadcrumb data={breadcrumbData} />}
      {getComponents(pageData)}
      {breadcrumbData && <Breadcrumb data={breadcrumbData} position={BreadcrumbPosition.bottom} />}
    </>
  );
};

export default DynamicPage;
