import { PageHeader, Row, Col } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './search-bar';

export default function Header() {

  return (
    <PageHeader style={{ boxShadow: '0 4px 2px -2px gray', padding: 0 }}>
      <Row style={{ alignItems: 'center', paddingBottom: '12px' }}>
        <Col>
          <Link to='/'>
            <img //TODO: replace with configurable logo
              src='https://pbs.twimg.com/profile_images/878250120587997184/siODyNVB_400x400.jpg'
              alt='university logo'
              style={{ width: 60 }}
            />
          </Link>
        </Col>
        <Col span={12}>
          <SearchBar />
        </Col>
      </Row>
    </PageHeader>
  );
}
