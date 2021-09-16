import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Table, message, Card } from 'antd';
import AdvancedForm from 'advanced-antd-form';
import { generateColumns, request } from './utils';

import type { TableRowSelection } from 'antd/es/table/interface'
import type { PaginationProps } from 'antd/es/pagination';
import type { ListRenderProps } from '../types/Types';
import styles from './index.less';

function AdvanceList<RecordType>(props: ListRenderProps<RecordType>) {
  const { rowKey, listQuery, url, config, columns, formProps, operators } = props;

  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const memorizedQuery = useCallback(async () => {
    setLoading(true);
    if (listQuery) listQuery({...formValues, current: pageNo, pageSize}, (value) => { setLoading(false); setData(value); });
    else if (url){
      const res = await request(url, {
        method: 'POST'
      });
      if(res.success) {
        setData(res.data);
      } else {
        message.error(res.msg);
      }
    }
  }, [formValues, pageNo, pageSize, listQuery, url]); 

  useEffect(() => {
    memorizedQuery();
  }, [memorizedQuery]);

  const memorizedColumns = useMemo(() => generateColumns(columns, config), [columns, config]);

  const load = (values: Record<string, unknown>) => {
    setFormValues(values);
    setPageNo(1);
    setPageSize(10);
  };

  const onSelectChange = (values: string[]) => {
    setSelectedRowKeys(values);
  };

  const rowSelection: TableRowSelection<unknown> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const showTotal = (total: number) => {
    return `总共 ${total} 条记录`;
  }

  const pagination: PaginationProps = {
    total: ((data?.length) || 0),
    showTotal,
    showSizeChanger: true,
    showQuickJumper: true,
    current: pageNo,
    pageSize,
  };

  const handleTableChange = (_pagination: PaginationProps) => {
    setPageNo(_pagination.current as number);
    setPageSize(_pagination.pageSize as number);
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div>
      <div>
        {formProps && formProps.fields?.length && (
          <div id="search-form" className={styles.searchForm}>
            <AdvancedForm config={config} type="search" onLoad={load} fields={formProps.fields as string[]} {...formProps} />
          </div>
        )}
      </div>
      <div id="body">
        <Card>
          <div id="operators" style={{ marginBottom: 16 }}>
            {operators && operators(selectedRowKeys)}
            {operators && (
              <span style={{ marginLeft: 8 }}>
                {hasSelected ? `已选中 ${selectedRowKeys.length} 条记录` : ''}
              </span>
            )}
          </div>
          <div id="table">
            <Table
              rowKey={rowKey}
              loading={loading}
              rowSelection={rowSelection}
              columns={memorizedColumns}
              scroll={{ x: '100%' }}
              dataSource={data}
              pagination={pagination}
              onChange={handleTableChange}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AdvanceList;
