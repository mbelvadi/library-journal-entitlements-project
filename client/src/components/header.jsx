import { PageHeader, Row, Col, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './search-bar';

export default function Header(props) {
  const { onClickDownload } = props;
  const navigate = useNavigate();

  return (
    <PageHeader
      style={{
        boxShadow: '5px 8px 24px 5px rgba(208, 216, 243, 0.6)',
        padding: 0,
      }}
    >
      <Row
        style={{ alignItems: 'center', paddingBottom: '12px' }}
        justify='space-between'
      >
        <Col md={12}>
          <Row style={{ alignItems: 'center' }}>
            <Link to='/'>
              <img //TODO: replace with configurable logo
                src='https://pbs.twimg.com/profile_images/878250120587997184/siODyNVB_400x400.jpg'
                alt='university logo'
                style={{ width: 60 }}
              />
            </Link>
            <SearchBar />
          </Row>
        </Col>
        <Col
          md={6}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            margin: '10px',
          }}
        >
          {onClickDownload && (
            <Button
              type='primary'
              shape='round'
              icon={<DownloadOutlined />}
              onClick={props.onClickDownload}
            >
              TSV
            </Button>
          )}
          <Button
            type='default'
            shape='round'
            onClick={() => {
              navigate('/admin');
            }}
            style={{
              marginRight: '20px',
              marginLeft: '10px',
            }}
          >
            Admin
          </Button>
        </Col>
      </Row>
    </PageHeader>
  );
}
