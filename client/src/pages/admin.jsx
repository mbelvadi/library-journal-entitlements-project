import React from 'react';
import { API_URL } from '../util';
import { Row, Col, Card, Spin, Form, Input, Button, Avatar, Alert } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default function Admin() {
  const [adminSetup, setAdminSetup] = React.useState(false);
  const [loadingPage, setLoadingPage] = React.useState(true);
  const [loginMessage, setLoginMessage] = React.useState('');

  React.useEffect(() => {
    const fetchAdminStatus = async () => {
      const res = await fetch(`${API_URL}/admin/setup`);
      if (res.status === 200) {
        setAdminSetup(true);
      }
      setLoadingPage(false);
    };
    fetchAdminStatus();
  }, []);

  return (
    <Row>
      <Col
        span={12}
        offset={6}
        style={{ display: 'flex', justifyContent: 'center', marginTop: '10vh' }}
      >
        {loadingPage && <Spin tip='Loading...' size='large' />}
        {!loadingPage && (
          <Card
            style={{
              boxShadow: '5px 8px 24px 5px rgba(208, 216, 243, 0.6)',
              maxWidth: '700px',
              minWidth: '300px',
              width: '50vw',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                marginBottom: '20px',
              }}
            >
              <Avatar
                style={{ backgroundColor: '#1890ff', marginBottom: '20px' }}
                size={100}
                icon={<UserOutlined />}
              />
              <h1>{adminSetup ? 'Admin Login' : 'Admin Setup'}</h1>
            </div>
            {adminSetup ? (
              <AdminLoginForm loginMessage={loginMessage} />
            ) : (
              <AdminSetupForm
                setAdminSetup={setAdminSetup}
                setLoginMessage={setLoginMessage}
              />
            )}
          </Card>
        )}
      </Col>
    </Row>
  );
}

function AdminSetupForm(props) {
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
        messageVariables='test'
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

function AdminLoginForm(props) {
  const { loginMessage } = props;

  const handleSubmit = async (values) => {
    console.log('SUBMITTING', values);
  };

  return (
    <Form onFinish={handleSubmit} layout='vertical'>
      {loginMessage && (
        <Alert
          type='success'
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
          htmlType='submit'
          style={{ width: '100px' }}
        >
          Submit
        </Button>
      </div>
    </Form>
  );
}
