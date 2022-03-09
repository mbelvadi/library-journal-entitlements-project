import { Form, Input, Col, Dropdown, DatePicker, Card } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar(props) {
  const [query, setQuery] = useState(props.query);
  const [filters, setFilters] = useState({});
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  const handleSubmitSearch = async (e) => {
    // remove focus from search bar
    e.target.parentElement.children[0].blur();

    // get rid of empty string form items
    let nonEmptyFilters = {};
    for (const property in filters) {
      if(filters[property] != '') {
        nonEmptyFilters[property] = filters[property];
      }
    }

    let filterURLPart = new URLSearchParams(nonEmptyFilters).toString();

    if (filterURLPart) {
      filterURLPart = '&'+filterURLPart;
    }

    navigate(`/search?query=${query}${filterURLPart}`);
  };

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  const filterFormItem = (name, title, content) => (
    <Form.Item name={name} style={{ marginBottom: 0 }}>
      <Card title={title} size='small'>
        {content}
      </Card>
    </Form.Item>
  );

  const filterForm = (
    <>
      {filterFormItem(
        'yearFilter',
        'Specific Year',
        <DatePicker
          picker='year'
          bordered={false}
          value={filters.specificYearFilter}
          onChange={(moment, value) => {
            setFilters({ ...filters, 'year': value });
          }}
        />
      )}
      {filterFormItem(
        'startYearFilter',
        'Start Year',
        <DatePicker
          picker='year'
          bordered={false}
          value={filters.startYearFilter}
          onChange={(moment, value) => {
            setFilters({ ...filters, 'startYear': value });
          }}
        />
      )}
      {filterFormItem(
        'endYearFilter',
        'End Year',
        <DatePicker
          picker='year'
          bordered={false}
          value={filters.endYearFilter}
          onChange={(moment, value) => {
            setFilters({ ...filters, 'endYear': value });
          }}
        />
      )}
    </>
  );

  return (
    <Form
      onSubmit={handleSubmitSearch}
      layout='inline'
      style={{ marginLeft: 50 }}
    >
      <Col span={18}>
        <Input
          placeholder='Search...'
          size='large'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        ></Input>
        <button
          type='submit'
          onClick={handleSubmitSearch}
          style={{ display: 'none' }}
        ></button>
      </Col>
      <Col
        span={6}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Dropdown.Button
          type='primary'
          overlay={filterForm}
          icon={<FilterOutlined />}
          trigger={['click']}
          onVisibleChange={handleVisibleChange}
          visible={visible}
          onClick={handleSubmitSearch}
        >
          Search
        </Dropdown.Button>
      </Col>
    </Form>
  );
}
