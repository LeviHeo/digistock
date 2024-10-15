'use client';
import { createContext, useState } from 'react';

export const ConfigContext = createContext<{
  isNavShow: boolean;
  setNavShow: Function;
  isMobNavShow: boolean;
  setMobNavShow: Function;
  isMobSubNavShow: boolean;
  setMobSubNavShow: Function;
  isMobHighlightCtaShow: boolean;
  setMobHighlightCtaShow: Function;
  dictionary: null;
  setDictionary: Function;
  languages: Record<string, any> | null;
  setLanguages: Function;
  screen: String | null;
  setScreen: Function;
  screenList: String | null;
  setScreenList: Function;
  showHeader: boolean;
  setShowHeader: Function;
}>({
  isNavShow: false,
  setNavShow: () => '',
  isMobNavShow: false,
  setMobNavShow: () => '',
  isMobSubNavShow: false,
  setMobSubNavShow: () => '',
  isMobHighlightCtaShow: true,
  setMobHighlightCtaShow: () => '',
  dictionary: null,
  setDictionary: () => {},
  languages: {},
  setLanguages: () => '',
  screen: null,
  setScreen: () => '',
  screenList: null,
  setScreenList: () => '',
  showHeader: true,
  setShowHeader: () => '',
});

export const ConfigContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [dictionary, setDictionary] = useState<any>(null);
  const [isNavShow, setNavShow] = useState<boolean>(false);
  const [isMobNavShow, setMobNavShow] = useState<boolean>(false);
  const [isMobSubNavShow, setMobSubNavShow] = useState<boolean>(false);
  const [isMobHighlightCtaShow, setMobHighlightCtaShow] = useState<boolean>(true);
  const [languages, setLanguages] = useState<Object | null>(null);
  const [screen, setScreen] = useState<String | null>(null);
  const [screenList, setScreenList] = useState<String | null>(null);
  const [showHeader, setShowHeader] = useState<boolean>(true);

  return (
    <ConfigContext.Provider
      value={{
        dictionary,
        setDictionary,
        languages,
        setLanguages,
        isNavShow,
        setNavShow,
        isMobNavShow,
        setMobNavShow,
        isMobSubNavShow,
        setMobSubNavShow,
        isMobHighlightCtaShow,
        setMobHighlightCtaShow,
        screen,
        setScreen,
        screenList,
        setScreenList,
        showHeader,
        setShowHeader,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
