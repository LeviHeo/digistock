import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['var(--font-roboto)', '"微軟正黑體"', 'Helvetica', 'sans-serif'],
        'open-sans': ['var(--font-open-sans)', '"微軟正黑體"', 'Helvetica', 'sans-serif'],
        'noto-sans-tc': ['var(--font-noto-sans-tc)', 'Microsoft JhengHei', '"微軟正黑體"', 'Helvetica', 'sans-serif'],
        'noto-sans-sc': ['var(--font-noto-sans-sc)', 'Microsoft Yahei', '"微软雅黑"', 'Helvetica', 'sans-serif'],
      },
      colors: {
        primary: '#01b8f2',
        'primary-hover': '#0058E6',
        dark: '#363949',
        secondary: '#ffe500',
        error: '#ff3600',
      },
      screens: {
        xxs: '300px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        hd: '1440px',
        xxl: '1920px',
      },
      maxWidth: {
        'content-sm': '900px',
        content: '1340px',
        hd: '1440px',
        wrapper: '1920px',
      },
      padding: {
        'main-spacing-x-sm': 'var(--main-spacing-x-sm)',
        'main-spacing-x': 'var(--main-spacing-x)',
        'main-spacing-x-lg': 'calc(var(--main-spacing-x)*2)',
        'content-spacing-x-lg': 'calc(var(--main-spacing-x)*3)',
      },
      margin: {
        'main-spacing-x-sm': 'var(--main-spacing-x-sm)',
        'main-spacing-x': 'var(--main-spacing-x)',
        'main-spacing-x-lg': 'calc(var(--main-spacing-x)*2)',
      },
      zIndex: {
        headerWrap: '100',
        popupMask: '98',
        main: '91',
        footer: '90',
        navMobBtn: '90',
        navMobList: '88',
        navContainer: '88',
        headerLogo: '87',
        headerLogoMd: '90',
        progressBar: '97',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
export default config;
