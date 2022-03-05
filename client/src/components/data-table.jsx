import React from 'react';
import Highlighter from 'react-highlight-words';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import downloadFileToClient from '../functions/downloadFileToClient';

export default class DataTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      searchedColumn: '',
      filteredData: [],
    };
  }

  getColumnSearchProps = (dataIndex) => ({
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
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
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
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
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
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  replaceDelimiters = (string, char) => {
    const delimeters = ['_', '-'];
    for (const delimeter of delimeters) {
      string = string.replaceAll(delimeter, char);
    }
    return string;
  };

  capitalizeWords = (string) => {
    let finalString = '';
    const splitString = string.split(' ');

    for (const word in splitString) {
      finalString += word.charAt(0).toUpperCase() + word.slice(1);
    }
    return finalString;
  };

  // should make configurable
  crknColumnsTitles = [
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

  getColumns = (element) => {
    const columns = [];
    let properties = [];
    let title = '';

    const isCRKN = element.filename.toLowerCase().includes('crkn');

    if (isCRKN) {
      properties = this.crknColumnsTitles;
    } else {
      properties = Object.keys(element);
    }

    for (const property of properties) {
      title = this.replaceDelimiters(property, ' ');
      if (!isCRKN) {
        title = this.capitalizeWords(title);
      }

      columns.push({
        title: title,
        dataIndex: property.toLowerCase(),
        key: property.toLowerCase(),
        ...this.getColumnSearchProps(property.toLowerCase()),
      });
    }

    return columns;
  };

  onChange = (pagination, filters, sorter, extra) => {
    this.setState({ filteredData: extra.currentDataSource });
  };

  resultsToTSV = () => {
    const resultsToExport = this.state.filteredData.map(
      ({ key, ...keepAttrs }) => keepAttrs
    );
    const replacer = (key, value) => (value === null ? '' : value); //TODO: how to handle nulls?
    const delimeter = '\t'; //TODO: can easily change to CSV
    const fileExtension = 'tsv'
    const header = Object.keys(resultsToExport[0]);
    let tsv = [
      header.join(delimeter),
      ...resultsToExport.map((row) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(delimeter)
      ),
    ].join('\r\n').replaceAll('"', '');

    downloadFileToClient(new Blob([tsv], { type: 'text/'+fileExtension }), 'report.'+fileExtension); //TODO: come up with a useful filename template
  };

  render() {
    let dataSource = [];
    let columns = [];

    if (this.props.data?.results?.length > 0) {
      dataSource = this.props.data.results;
      columns = this.getColumns(dataSource[0]);
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
        onChange={this.onChange}
      />
    );
  }
}
