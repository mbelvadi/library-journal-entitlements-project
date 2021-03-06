import React from 'react';
import { Form, Input, Button, Alert } from 'antd';
import AppContext from '../../util/appContext';

export default function AdminLoginForm(props) {
  const { loginMessage, setLoginMessage, setLoggedIn } = props;
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState(undefined);
  const { apiRoute } = React.useContext(AppContext);

  const handleSubmit = async (values) => {
    setLoginMessage('');
    setError(undefined);
    setSubmitting(true);
    try {
      const res = await fetch(`${apiRoute}/admin/login`, {
        method: 'POST',
        body: JSON.stringify(values),
      });
      const data = await res.json();

      setSubmitting(false);
      if (res.status === 200) {
        sessionStorage.setItem('adminKey', data.adminKey);
        setLoggedIn(true);
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error(error);
      setSubmitting(false);
      setError('An unexpected error occurred.');
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
      {loginMessage && (
        <Alert
          type='info'
          message={loginMessage}
          showIcon
          style={{ marginBottom: '10px' }}
        />
      )}
      <Form.Item
        name='password'
        label='Password'
        rules={[{ required: true, message: 'This field is required' }]}
      >
        <Input size='large' placeholder='Password' type='password' />
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
