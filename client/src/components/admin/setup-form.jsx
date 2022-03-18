import React from 'react';
import { API_URL } from '../../util';
import { Form, Input, Button, Alert } from 'antd';

export default function AdminSetupForm(props) {
  const { setLoginMessage, setAdminSetup } = props;
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState(undefined);

  const handleSubmit = async (values) => {
    setError(undefined);
    setSubmitting(true);
    const res = await fetch(`${API_URL}/admin/create`, {
      method: 'POST',
      body: JSON.stringify(values),
    });
    const data = await res.json();

    setSubmitting(false);
    if (res.status === 200) {
      setLoginMessage(data.message);
      setAdminSetup(true);
    } else {
      setError(data.error);
    }
  };

  return (
    <Form onFinish={handleSubmit} layout='vertical'>
      {error && (
        <Alert
          type='error'
          message={error}
          showIcon
          style={{ marginBottom: '10px' }}
        />
      )}
      <Form.Item
        name='adminCode'
        label='Admin Code'
        rules={[{ required: true, message: 'This field is required' }]}
      >
        <Input size='large' placeholder='Admin Code' type='password' />
      </Form.Item>
      <Form.Item
        name='password'
        label='Password'
        rules={[{ required: true, message: 'This field is required' }]}
      >
        <Input size='large' placeholder='Password' type='password' />
      </Form.Item>
      <Form.Item
        name='confirmPassword'
        label='Confirm password'
        rules={[{ required: true, message: 'This field is required' }]}
      >
        <Input size='large' placeholder='Confirm Password' type='password' />
      </Form.Item>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type='primary'
          size='large'
          loading={submitting}
          htmlType='submit'
          style={{ width: '100px' }}
        >
          Submit
        </Button>
      </div>
    </Form>
  );
}
