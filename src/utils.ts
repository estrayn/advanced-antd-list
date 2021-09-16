import type { AdvancedConfig } from '../types/Types';
import type { ColumnType } from 'antd/es/table';
import { message } from 'antd';

type AdvancedColumnType = ColumnType<unknown> | string;

export function generateColumns(columns: AdvancedColumnType[], config: AdvancedConfig) {
  return columns.map(column => {
    if(typeof column === 'string') {
      return {
        title: config.names[column],
        dataIndex: [column],
        width: '200px',
        ellipsis: true,
      };
    }
    if (typeof column === 'object') {
      const newColumn = column as ColumnType<unknown>;
      return {
        title: config.names[newColumn?.dataIndex as string],
        ellipsis: true,
        width: '200px',
        ...column
      }
    }
    message.error(`${column}列未正确配置`);
    return {};
  });
}

export function request(url, data, options = {}) {
  return fetch(url, {
    body: JSON.stringify(data),
    cache: 'no-cache',
    credentials: 'include', // include, same-origin, *omit
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // *client, no-referrer
    ...options,
  })
  .then(response => response.json())
}