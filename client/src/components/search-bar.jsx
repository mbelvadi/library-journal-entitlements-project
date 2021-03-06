import {
  Form,
  Input,
  Col,
  Row,
  Dropdown,
  DatePicker,
  Typography,
  Menu,
} from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Text = Typography.Text;

export default function SearchBar(props) {
  const [query, setQuery] = useState(props.query ?? '');
  const [filters, setFilters] = useState({});
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  const handleSubmitSearch = async (e) => {
    // remove focus from search bar
    e.target.parentElement.children[0].blur();

    // get rid of empty string form items
    let nonEmptyFilters = {};
    for (const property in filters) {
      if (filters[property] !== '') {
        nonEmptyFilters[property] = filters[property];
      }
    }

    let filterURLPart = new URLSearchParams(nonEmptyFilters).toString();

    if (filterURLPart) {
      filterURLPart = '&' + filterURLPart;
    }

    navigate(`/search?query=${encodeURIComponent(query)}${filterURLPart}`);
  };

  const handleVisibleChange = (flag) => setVisible(flag);

  let menuItemKey = 0;

  const filterMenuItem = (name, content) => (
    <Menu.Item title={name} key={(menuItemKey += 1)}>
      <Row align='middle'>
        <Col flex={'auto'}>
          <Text>{name}</Text>
        </Col>
        <Col span={14}>{content}</Col>
      </Row>
    </Menu.Item>
  );

  const filterMenu = (
    <Menu>
      {filterMenuItem(
        'Specific Year',
        <DatePicker
          picker='year'
          bordered={true}
          value={filters.specificYearFilter}
          onChange={(_moment, value) => setFilters({ ...filters, year: value })}
        />
      )}
      {filterMenuItem(
        'Start Year',
        <DatePicker
          picker='year'
          bordered={true}
          value={filters.startYearFilter}
          onChange={(_moment, value) =>
            setFilters({ ...filters, startYear: value })
          }
        />
      )}
      {filterMenuItem(
        'End Year',
        <DatePicker
          picker='year'
          bordered={true}
          value={filters.endYearFilter}
          onChange={(_moment, value) =>
            setFilters({ ...filters, endYear: value })
          }
        />
      )}
    </Menu>
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
            onPressEnter={handleSubmitSearch}
          />
        </Col>
        <Col span={6} offset={1}>
          <Dropdown.Button
            type='primary'
            size='large'
            overlay={filterMenu}
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
