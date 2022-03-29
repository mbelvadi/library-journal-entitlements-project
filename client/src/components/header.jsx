import { PageHeader, Row, Col, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './search-bar';
import AppContext from '../util/styleContext';
import AdminButton from './buttons/admin';
import HelpButton from './buttons/help';

export default function Header(props) {
  const { onClickDownload } = props;
  const { style } = React.useContext(AppContext);

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
              <img
                src={style?.logo}
                alt='university logo'
                style={{ width: 60 }}
              />
            </Link>
            <SearchBar query={props.query} />
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
              onClick={onClickDownload}
            >
              TSV
            </Button>
          )}
          <AdminButton
            style={{
              marginRight: '10px',
              marginLeft: '10px',
            }}
          />
          <HelpButton />
        </Col>
      </Row>
    </PageHeader>
  );
}
