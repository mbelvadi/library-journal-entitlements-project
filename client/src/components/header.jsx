import { PageHeader, Row, Col, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './search-bar';

export default function Header(props) {
  const navigate = useNavigate();

  let tsvButton = <></>;

  if (props.onClickDownload) {
    tsvButton = (
      <Button
        size='large'
        type='primary'
        shape='round'
        icon={<DownloadOutlined />}
        onClick={props.onClickDownload}
      >
        TSV
      </Button>
    );
  }

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
          <SearchBar query={props.query} />
        </Col>
        <Col span={2} offset={8}>
          {tsvButton}
        </Col>
        <Col>
          <Button
            type='primary'
            size='large'
            onClick={() => {
              navigate('/admin');
            }}
            style={{
              marginRight: '20px',
            }}
          >
            Admin
          </Button>
        </Col>
      </Row>
    </PageHeader>
  );
}
