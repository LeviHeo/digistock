import { HTMLInputTypeAttribute } from 'react';

export enum DataTypeProps {
  test = 'test', // use local i18n data
  data = 'data', // fetch from CMS API
}

export type Module<T, O> = {
  id: string;
  module: string;
  moduleOption: O;
  content: T;
};

export enum ButtonVariantion {
  primary = 'primary',
  secondary = 'secondary',
  outline = 'outline',
  default = 'default',
}

export enum ButtonSize {
  md = 'md',
  sm = 'sm',
  lg = 'lg',
}

export enum ButtonColor {
  red = 'red',
  black = 'black',
  white = 'white',
}

export enum ButtonShape {
  cirlce = 'circle',
  rectangle = 'rectangle',
}

export enum ButtonIconPosition {
  left = 'left',
  right = 'right',
}

export enum ButtonAction {
  routeLink = 'routeLink',
  external = 'external',
  callback = 'callback',
  newWindow = 'newWindow',
  submit = 'submit',
  sidePanel = 'sidePanel',
}

export type ButtonLinkElement = {
  type: ButtonAction | string;
  href: string;
};

export type ButtonElementDefault = {
  label: string;
  link: ButtonLinkElement;
};

export type ButtonElement<IconList> = ButtonElementDefault & {
  theme?: ButtonVariantion | string;
  color?: ButtonColor | string;
  icon?: {
    name: IconList;
    position: ButtonIconPosition;
  } | null;
  callback?: () => void;
  callBackData?: any;
};

export enum MediaFormat {
  image = 'image',
  video = 'video',
}

export type Source = {
  desktop: string;
  mobile: string;
};

export type MediaElement = {
  type: MediaFormat;
  src: Source;
  alt: string;
  poster: MediaElement;
  mediaCaption: string;
};

export type OmitFieldKey = 'name' | 'label' | 'type' | 'defaultValue' | 'max' | 'min';
export type FieldType =
  | 'text'
  | 'date'
  | 'time'
  | 'select'
  | 'textArea'
  | 'contactNumber'
  | 'checkbox'
  | 'radio'
  | 'password'
  | 'maillingAddress'
  | 'checkWithInput'
  | 'optionWithThumb'
  | 'autocomplete'
  | 'file';

export interface Option {
  label: string;
  value: string;
  media?: MediaElement;
}

export interface Fields<T> {
  inputRow: boolean;
  inputRowClassName?: string;
  items: T[];
}
export interface FieldProps<T = Option> {
  rowsize?: 'full' | 'half';
  fieldName?: string;
  element?: FieldType;
  type?: HTMLInputTypeAttribute;
  label?: string;
  defaultValue?: string;
  remark?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  options?: any[];
  error?: string;
  helpText?: string;
}

export interface FCData {
  FcPageId: string;
  FcCode: string;
  IncomeCode?: string;
}

export interface PaginationState {
  countPerPage: number;
  page: number;
  totalCount: number;
  totalPage: number;
}
