import React from 'react';
import { Module } from '@/types/index';
import { ModuleList } from '@/types/modules';

const getComponents = (data: Record<string, any>) => {
  const generateComponent = (item: Module<any, any>, index: number) => {
    const key = `component${index}`;

    if (typeof ModuleList[item.module] !== 'undefined') {
      return React.createElement(ModuleList[item.module], {
        key,
        order: index,
        data: item,
        did: data?.did || null,
      });
    }

    return React.createElement(
      () => <section className='noComponent'>The component {item.module} has not been created yet.</section>,
      { key }
    );
  };

  return data?.content.map((item: Module<any, any>, index: number) => generateComponent(item, index));
};

export default getComponents;
