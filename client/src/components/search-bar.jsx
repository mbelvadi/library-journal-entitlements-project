import { Form, Input, Col, Row, Dropdown, DatePicker, Card } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmitSearch = async (e) => {
    e.target.parentElement.children[0].blur();
    navigate(`/search?query=${query}`);
    setQuery('');
  };

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  const { RangePicker } = DatePicker;

  const filterFormItem = (name, title, content) => (
    <Form.Item name={name}>
      <Card title={title} size='small'>
        {content}
      </Card>
    </Form.Item>
  );

  const filterForm = (
    <Form layout='vertical'>
      {filterFormItem(
        'yearFilter',
        'Specific Year',
        <DatePicker picker='year' bordered={false} />
      )}
      {filterFormItem(
        'yearRangeFilter',
        'Year Range',
        <RangePicker picker='year' bordered={false} />
      )}
    </Form>
  );

  return (
    <Row justify='center'>
      <Form
        onSubmit={handleSubmitSearch}
        layout='inline'
        style={{
          width: '100%',
          maxWidth: '700px',
        }}
      >
        <Col span={17}>
          <Input
            placeholder='Search...'
            size='large'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type='submit'
            onClick={handleSubmitSearch}
            style={{ display: 'none' }}
          ></button>
        </Col>
        <Col span={6} offset={1}>
          <Dropdown.Button
            type='primary'
            size='large'
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
    </Row>
  );
}
