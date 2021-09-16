import type React from 'react';
import type { Rule } from 'rc-field-form/lib/interface';
import type { ColumnType } from 'antd/es/table';

export type AdvancedColumnType<RecordType> = ColumnType<RecordType> | string;
export type ColumnsType<RecordType> = AdvancedColumnType<RecordType>[];

export interface FormItem {
  type: React.ComponentType | string;
  name?: string;
  label?: string;
  render?: () => React.ReactElement;
  elProps?: Record<string | number | symbol, unknown>;
  itemProps?: Record<string | number | symbol, unknown>;
  rules?: Rule[];
  [prop: string]: unknown;
};

export interface FormRenderProps {
  config: AdvancedConfig;
  fields: string[];
  rules?: Record<string, Rule[]>;
  type: 'search' | 'modal' | 'drawer';
  title?: string;
  buttonsLayout?: 'inline' | 'outline';
  isAdvance?: boolean;
  values?: Record<string, unknown>;
  url?: string;
  beforeSubmit?: (formValues: Record<string, unknown>) => unknown;
  onLoad?: (formValues: Record<string, unknown>) => void;
  onSubmit?: (formValues: Record<string, unknown>) => (void | Promise<any>);
  cols?: undefined | 1 | 2 | 3 | 4 | 6;
  [prop: string]: unknown;
};

export interface AdvancedConfig {
  names: Record<string, string>;
  fields: Record<string, FormItem | React.ComponentType | string>;
}

export interface ListRenderProps<RecordType> {
  rowKey: string;
  listQuery?: (params: Record<string, unknown>, callback: (params: Record<string, unknown>[]) => void) => void;
  url?: string;
  config: AdvancedConfig;
  columns: ColumnsType<RecordType>;
  formProps?: Partial<FormRenderProps> | undefined;
  operators?: (props: unknown) => React.ReactElement | undefined;
}
