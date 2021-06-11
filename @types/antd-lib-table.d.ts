import {
  TableProps as AntdTableProps,
} from 'antd/lib/table';

declare module 'antd/lib/table' {

  export interface TableProps<RecordType = any> extends AntdTableProps<RecordType> {
    'showSizeChanger'?: boolean;
  }
}
