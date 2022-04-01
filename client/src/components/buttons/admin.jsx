import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function AdminButton({ style }) {
  const navigate = useNavigate();
  return (
    <Button
      type='default'
      shape='round'
      onClick={() => navigate('/admin')}
      style={style}
    >
      Admin
    </Button>
  );
}
