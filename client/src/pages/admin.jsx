import React from 'react';
import { API_URL } from '../util';
import {
  Row,
  Col,
  Card,
  Spin,
  Form,
  Input,
  Button,
  Avatar,
  Alert,
  Divider,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default function Admin() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [adminSetup, setAdminSetup] = React.useState(false);
  const [loadingPage, setLoadingPage] = React.useState(true);
  const [loginMessage, setLoginMessage] = React.useState('');

  React.useEffect(() => {
    const fetchAdminStatus = async () => {
      const res = await fetch(`${API_URL}/admin/setup`);
      if (res.status === 200) {
        setAdminSetup(true);
        if (sessionStorage.getItem('adminKey')) {
          setLoggedIn(true);
        }
      }
      setLoadingPage(false);
    };
    fetchAdminStatus();
  }, []);

  return (
    <Row>
      <Col md={{ span: 12, offset: 6 }} style={{ display: 'flex' }}>
        <div style={{ justifyContent: 'center', marginTop: '10vh' }}>
          {loadingPage && <Spin tip='Loading...' size='large' />}
          {!loadingPage && !loggedIn && (
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
                <AdminLoginForm
                  loginMessage={loginMessage}
                  setLoginMessage={setLoginMessage}
                  setLoggedIn={setLoggedIn}
                />
              ) : (
                <AdminSetupForm
                  setAdminSetup={setAdminSetup}
                  setLoginMessage={setLoginMessage}
                />
              )}
            </Card>
          )}
        </div>
        {loggedIn && (
          <AdminControls
            setLoggedIn={setLoggedIn}
            setLoginMessage={setLoginMessage}
          />
        )}
      </Col>
    </Row>
  );
}

function AdminControls(props) {
  const { setLoggedIn, setLoginMessage } = props;
  const [error, setError] = React.useState(undefined);
  const [successMsg, setSuccessMsg] = React.useState(undefined);
  const [crknRefreshing, setCrknRefreshing] = React.useState(false);
  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [uploadingFile, setUploadingFile] = React.useState(false);

  const refreshCrknData = async () => {
    setError(undefined);
    setSuccessMsg(undefined);
    setCrknRefreshing(true);
    const res = await fetch(
      `${API_URL}/admin/fetch-crkn-files?adminKey=${sessionStorage.getItem(
        'adminKey'
      )}`
    );

    setCrknRefreshing(false);
    if (res.status === 200) {
      setSuccessMsg('Succesfully updated CRKN sheets.');
    } else if (res.status === 401) {
      sessionStorage.removeItem('adminKey');
      setLoginMessage('Admin session has expired. Please login again.');
      setLoggedIn(false);
    } else {
      setError('An unexpected error occurred.');
    }
  };

  const uploadFile = async () => {
    setError(undefined);
    setSuccessMsg(undefined);
    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('adminKey', sessionStorage.getItem('adminKey'));
    const res = await fetch(`${API_URL}/admin/upload`, {
      method: 'Post',
      body: formData,
    });
    const data = await res.json();
    console.log(data);
    setUploadingFile(false);

    if (res.status === 200) {
      setSuccessMsg('Succesfully uploaded spreadsheet.');
    } else if (res.status === 401) {
      sessionStorage.removeItem('adminKey');
      setLoginMessage('Admin session has expired. Please login again.');
      setLoggedIn(false);
    } else {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div
      style={{ marginTop: '30px', display: 'flex', flexDirection: 'column' }}
    >
      <h1>Admin Page</h1>
      {error && (
        <Alert
          type='error'
          message={error}
          showIcon
          style={{ marginBottom: '10px' }}
        />
      )}
      {successMsg && (
        <Alert
          type='success'
          message={successMsg}
          showIcon
          style={{ marginBottom: '10px' }}
        />
      )}
      <Button
        type='primary'
        size='large'
        onClick={refreshCrknData}
        loading={crknRefreshing}
      >
        Refresh CRKN data
      </Button>
      <Divider />
      <input
        type='file'
        accept='.xlsx, .csv, .tsv'
        onChange={(e) => setUploadedFile(e.target.files[0])}
      />
      <Button
        type='primary'
        size='large'
        onClick={uploadFile}
        disabled={!uploadedFile}
        loading={uploadingFile}
        style={{ marginTop: '10px' }}
      >
        Upload file
      </Button>
    </div>
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
  const { loginMessage, setLoginMessage, setLoggedIn } = props;
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState(undefined);

  const handleSubmit = async (values) => {
    setLoginMessage('');
    setError(undefined);
    setSubmitting(true);
    const res = await fetch(`${API_URL}/admin/login`, {
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
