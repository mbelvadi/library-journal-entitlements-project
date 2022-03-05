import { Form, Input, Button, Col } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar(props) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.target.parentElement.children[0].blur();
    navigate(`/search?query=${query}`);
    setQuery('');
  };

  return (
    <Form onSubmit={handleSubmit} layout='inline'
    style={{ marginLeft: 50 }}>
      <Col span={20}>
        <Input
          placeholder='Search...'
          size='large'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        ></Input>
        <button
          type='submit'
          onClick={handleSubmit}
          style={{ display: 'none' }}
        ></button>
      </Col>
      <Col
        span={4}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Button type='primary'>Filters</Button>
      </Col>
    </Form>
  );
}
