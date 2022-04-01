import React from 'react';
import Highlighter from 'react-highlight-words';
import { Table, Input, Button, Space } from 'antd';
import { FilterFilled } from '@ant-design/icons';
import AppContext from '../util/appContext';

export default function DataTable(props) {
  const { data, setDisplayedData } = props;
  const [filterText, setFilterText] = React.useState('');
  const [filterInput, setFilterInput] = React.useState({});
  const [filteredColumn, setFilteredColumn] = React.useState('');

  const mapIndexToColumn = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => setFilterInput(node)}
          placeholder={`Filter by ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleFilter(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleFilter(selectedKeys, confirm, dataIndex)}
            icon={<FilterFilled />}
            size='small'
            style={{ width: 90 }}
          >
            Filter
          </Button>
          <Button
            onClick={() =>
              handleReset(clearFilters, selectedKeys, confirm, dataIndex)
            }
            size='small'
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <FilterFilled style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => filterInput.select(), 100);
      }
    },
    render: (text) =>
      filteredColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[filterText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleFilter = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setFilterText(selectedKeys[0]);
    setFilteredColumn(dataIndex);
  };

  const handleReset = (clearFilters, selectedKeys, confirm, _dataIndex) => {
    clearFilters();
    setFilterText('');
    handleFilter(selectedKeys, confirm, null);
  };

  const replaceDelimiters = (string, char) => {
    const delimeters = ['_', '-'];
    for (const delimeter of delimeters) {
      string = string.replaceAll(delimeter, char);
    }
    return string;
  };

  // order of this list is reflected in the table
  const crknColumnNames = [
    'Title',
    'Package_Name',
    'Collection_Name',
    'Year',
    'Title_ID',
    'Print_ISSN',
    'Online_ISSN',
    'Has_Former_Title',
    'Has_Succeeding_Title',
    'Agreement_Code',
    'Has_Rights',
  ];

  const getColumns = () => {
    const columns = [];

    for (const columnName of crknColumnNames) {
      let key = columnName.toLowerCase();

      columns.push({
        title: replaceDelimiters(columnName, ' '),
        dataIndex: key,
        key: key,
        ...mapIndexToColumn(key),
        sorter: (a, b) => {
          if (a[key]) {
            if (b[key]) {
              if (typeof a[key] === 'string') {
                return a[key].localeCompare(b[key]);
              } else {
                return a[key] - b[key];
              }
            } else {
              return -1;
            }
          } else {
            if (b[key]) {
              return 1;
            } else {
              return 0;
            }
          }
        },
      });
    }

    return columns;
  };

  const onTableChange = (_pagination, _filters, _sorter, extra) =>
    setDisplayedData(extra.currentDataSource);

  let dataSource = [];
  let columns = [];

  if (data?.results?.length > 0) {
    dataSource = data.results;
    columns = getColumns(dataSource[0]);
  }

  dataSource.forEach((element, i) => {
    element.key = i;
  });

  return (
    <Table
      columns={columns}
      scroll={{
        x: true,
      }}
      dataSource={dataSource}
      bordered={true}
      pagination={{
        position: ['topRight', 'bottomRight'],
        defaultPageSize: 100,
        pageSizeOptions: [100, 250, 500],
      }}
      onChange={onTableChange}
    />
  );
}
