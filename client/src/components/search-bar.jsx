import { Form, Input, Button } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function SearchBar(maxWidth) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.target.parentElement.children[0].blur();
    navigate(`/search?query=${query}`);
    setQuery('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        placeholder='Search...'
        size='large'
        style={{ maxWidth: maxWidth, marginRight: 15 }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      ></Input>
      <button
        type='submit'
        onClick={handleSubmit}
        style={{ display: 'none' }}
      ></button>
      <Button type='primary'>
        Filters
      </Button>
    </Form>
  );
}
