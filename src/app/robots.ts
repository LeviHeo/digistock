import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: process.env.ROBOTS_ALLOW_SEARCH === 'true' ? '/' : '',
      disallow: process.env.ROBOTS_ALLOW_SEARCH === 'true' ? '' : '/',
    },
    sitemap: [`${process.env.NEXT_PUBLIC_SITE_ENDPOINT}/sitemap.xml`],
  };
}
