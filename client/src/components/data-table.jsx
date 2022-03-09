import React from 'react';
import Highlighter from 'react-highlight-words';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export default function DataTable(props) {
  const { data, setDisplayedData } = props;
  const [searchText, setSearchText] = React.useState('');
  const [searchedColumn, setSearchedColumn] = React.useState('');

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size='small'
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
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
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const replaceDelimiters = (string, char) => {
    const delimeters = ['_', '-'];
    for (const delimeter of delimeters) {
      string = string.replaceAll(delimeter, char);
    }
    return string;
  };

  const capitalizeWords = (string) => {
    let finalString = '';
    const splitString = string.split(' ');

    for (const word in splitString) {
      finalString += word.charAt(0).toUpperCase() + word.slice(1);
    }
    return finalString;
  };

  // should make configurable
  const crknColumnsTitles = [
    'Has_Rights',
    'Title',
    'Collection_Name',
    'Year',
    'Title_ID',
    'Print_ISSN',
    'Online_ISSN',
    'Former_Title',
    'Succeeding_Title',
    'Agreement_Code',
  ];

  const getColumns = (element) => {
    const columns = [];
    let properties = [];
    let title = '';

    const isCRKN = element.filename.toLowerCase().includes('crkn');

    if (isCRKN) {
      properties = crknColumnsTitles;
    } else {
      properties = Object.keys(element);
    }

    for (const property of properties) {
      title = replaceDelimiters(property, ' ');
      if (!isCRKN) {
        title = capitalizeWords(title);
      }

      columns.push({
        title: title,
        dataIndex: property.toLowerCase(),
        key: property.toLowerCase(),
        ...getColumnSearchProps(property.toLowerCase()),
      });
    }

    return columns;
  };

  const onTableChange = (pagination, filters, sorter, extra) => {
    setDisplayedData(extra.currentDataSource);
  };

  let dataSource = [];
  let columns = [];

  if (data?.results?.length > 0) {
    dataSource = data.results;
    columns = getColumns(dataSource[0]);
  }

  dataSource.forEach(function (element, i) {
    element.key = i;
  });

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      bordered={true}
      pagination={{
        defaultPageSize: 100,
        pageSizeOptions: [100, 250, 500],
      }}
      onChange={onTableChange}
    />
  );
}
