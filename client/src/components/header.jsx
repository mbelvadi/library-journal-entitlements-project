import { Col, Form, Input, PageHeader, Row } from 'antd';
import React, { useState } from 'react';

export default function Header() {
  const [query, setQuery] = useState('');

  const handleSubmit = async (e) => {
    const res = await (
      await fetch(
        'http://localhost/upei-library-journal-project/server/routes/search',
        {
          method: 'POST',
          body: JSON.stringify({
            query: query,
          }),
        }
      )
    ).json();

    console.log(res);
  };

  return (
    <PageHeader style={{ boxShadow: '0 4px 2px -2px gray', padding: 0 }}>
      <Row style={{ alignItems: 'center', paddingBottom: '12px' }}>
        <img
          src='https://pbs.twimg.com/profile_images/878250120587997184/siODyNVB_400x400.jpg'
          alt='university logo'
          style={{ width: 60, marginRight: 10 }}
        />
        <Form onSubmit={handleSubmit}>
          <Input
            placeholder='Search...'
            size='large'
            style={{ maxWidth: 300 }}
            onChange={(e) => setQuery(e.target.value)}
          ></Input>
          <button
            type='submit'
            onClick={handleSubmit}
            style={{ display: 'none' }}
          ></button>
        </Form>
      </Row>
    </PageHeader>
  );
}
