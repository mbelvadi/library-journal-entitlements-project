import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import Header from '../components/header';

export default function NotFound() {
  return (
    <>
      <Layout>
        <Header maxWidth={900} />
        <Layout.Content style={{ padding: '0 2vw' }}>
          <h1>Not found</h1>
          <p>Sorry it looks like that page doesn't exist</p>
          <Link to='/'>Home</Link>
        </Layout.Content>
      </Layout>
    </>
  );
}
