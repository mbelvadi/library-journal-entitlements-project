import React from 'react';
import { API_URL } from '../util';
import {
  Layout,
  Row,
  Col,
  Card,
  Spin,
  Button,
  Avatar,
  Alert,
  Divider,
  Modal,
  Space,
  Checkbox,
  Form,
  Input,
} from 'antd';
import { ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import Header from '../components/header';
import AdminSetupForm from '../components/admin/setup-form';
import AdminLoginForm from '../components/admin/login-form';
import StyleContext from '../util/styleContext';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [error, setError] = React.useState(undefined);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [adminSetup, setAdminSetup] = React.useState(false);
  const [loadingPage, setLoadingPage] = React.useState(true);
  const [loginMessage, setLoginMessage] = React.useState('');
  const styleConfig = React.useContext(StyleContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchAdminStatus = async () => {
      const res = await fetch(`${API_URL}/admin/setup`);
      if (res.status === 200) {
        setAdminSetup(true);
        if (sessionStorage.getItem('adminKey')) {
          const resValid = await fetch(
            `${API_URL}/admin/valid-token?adminKey=${sessionStorage.getItem(
              'adminKey'
            )}`
          );
          if (resValid.status === 401) {
            setLoginMessage('Admin session has expired. Please login again.');
            setLoggedIn(false);
          } else {
            setLoggedIn(true);
          }
        }
      }
      setLoadingPage(false);
    };
    setError(undefined);
    fetchAdminStatus();
  }, []);

  const logout = async () => {
    if (!sessionStorage.getItem('adminKey')) navigate('/');

    setError(undefined);
    setLoggingOut(true);
    try {
      const res = await fetch(
        `${API_URL}/admin/logout?adminKey=${sessionStorage.getItem('adminKey')}`
      );
      setLoggingOut(false);
      if (res.status === 200 || res.status === 401) {
        sessionStorage.removeItem('adminKey');
        navigate('/');
      } else {
        setError('Failed to logout.');
      }
    } catch (error) {
      setLoggingOut(false);
      setError('Failed to logout');
    }
  };

  return (
    <Layout>
      <Header />
      <Layout.Content style={{ padding: '0 2vw' }}>
        <Col span={24} md={{ span: 12, offset: 6 }} style={{ display: 'flex' }}>
          {!loggedIn && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '10vh',
                width: '100%',
              }}
            >
              {loadingPage && <Spin tip='Loading...' size='large' />}
              {!loadingPage && (
                <Card
                  style={{
                    boxShadow: '5px 8px 24px 5px rgba(208, 216, 243, 0.6)',
                    maxWidth: '700px',
                    minWidth: '300px',
                    width: '100%',
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
                      style={{
                        backgroundColor: styleConfig?.color
                          ? styleConfig.color
                          : '#1890ff',
                        marginBottom: '20px',
                      }}
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
          )}
          {loggedIn && (
            <Col span={24} style={{ marginTop: '30px' }}>
              <Row justify='space-between'>
                <h1>Admin Page</h1>
                <Button
                  size='large'
                  shape='round'
                  onClick={logout}
                  loading={loggingOut}
                >
                  Logout
                </Button>
              </Row>
              {error && (
                <Alert
                  type='error'
                  message={error}
                  showIcon
                  style={{ marginBottom: '10px' }}
                />
              )}
              <FileModificationSection
                setLoggedIn={setLoggedIn}
                setLoginMessage={setLoginMessage}
              />
              <StyleConfigurationSection
                setLoggedIn={setLoggedIn}
                setLoginMessage={setLoginMessage}
              />
            </Col>
          )}
        </Col>
      </Layout.Content>
    </Layout>
  );
}

function StyleConfigurationSection(props) {
  const { setLoggedIn, setLoginMessage } = props;
  const [error, setError] = React.useState(undefined);
  const [successMsg, setSuccessMsg] = React.useState(undefined);
  const [color, setColor] = React.useState('');
  const [pageTitle, setPageTitle] = React.useState('');
  const [favicon, setFavicon] = React.useState('');
  const [logo, setLogo] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    const fetchStyles = async () => {
      try {
        const style = await (await fetch(`${API_URL}/style`)).json();
        setColor(style.color);
        setPageTitle(style.pageTitle);
        setFavicon(style.favicon);
        setLogo(style.logo);
      } catch (error) {
        setError('Failed to fetch styling config.');
      }
    };
    setError(undefined);
    fetchStyles();
  }, []);

  const confirmStyleUpdates = () => {
    Modal.confirm({
      title: 'Are you sure you want to update the site style configuration?',
      icon: <ExclamationCircleOutlined />,
      content:
        'In order for changes to be visible, after you update the configuration you may have to refresh your page.',
      async onOk() {
        setError(undefined);
        setSuccessMsg(undefined);
        setSubmitting(true);
        const formData = new FormData();
        formData.append('pageTitle', pageTitle);
        formData.append('color', color);
        formData.append('logo', logo);
        formData.append('favicon', favicon);
        formData.append('adminKey', sessionStorage.getItem('adminKey'));
        const res = await fetch(`${API_URL}/admin/set-style`, {
          method: 'Post',
          body: formData,
        });

        setSubmitting(false);
        if (res.status === 200) {
          setSuccessMsg(
            'Succesfully updated site style configuration. Please refresh page to view changes.'
          );
        } else if (res.status === 401) {
          sessionStorage.removeItem('adminKey');
          setLoginMessage('Admin session has expired. Please login again.');
          setLoggedIn(false);
        } else {
          setError('An unexpected error occurred.');
        }
      },
    });
  };

  return (
    <>
      <Divider>Style Configuration</Divider>
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

      <Form layout='vertical'>
        <Row gutter={24}>
          <Col span={24} md={12}>
            <Form.Item
              label='Primary Color'
              tooltip='The primary color used for the site. Please ensure your color is a valid css color (predefined color, hexcode, rgb, etc.)'
            >
              <Input
                value={color}
                size='large'
                placeholder='#0f0f0f'
                onChange={(e) => setColor(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item label='Main Logo' tooltip='Enter URL to public image.'>
              <Input
                value={logo}
                size='large'
                placeholder='https://..../image'
                onChange={(e) => setLogo(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24} md={12}>
            <Form.Item
              label='Page Title'
              tooltip='The title that is displayed in the tab.'
            >
              <Input
                value={pageTitle}
                size='large'
                placeholder='Page Title'
                onChange={(e) => setPageTitle(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item
              label='Favicon'
              tooltip='The little logo in the tab. Plase specify the URL to a public favicon (.ico) image.'
            >
              <Input
                value={favicon}
                size='large'
                placeholder='https://..../favicon.ico'
                onChange={(e) => setFavicon(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Button
          type='primary'
          size='large'
          loading={submitting}
          onClick={confirmStyleUpdates}
          style={{ width: '200px' }}
        >
          Update Style Config
        </Button>
      </Form>
    </>
  );
}

function FileModificationSection(props) {
  const { setLoggedIn, setLoginMessage } = props;
  const [error, setError] = React.useState(undefined);
  const [successMsg, setSuccessMsg] = React.useState(undefined);
  const [crknRefreshing, setCrknRefreshing] = React.useState(false);
  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [uploadingFile, setUploadingFile] = React.useState(false);
  const [serverFiles, setServerFiles] = React.useState([]);
  const [filesToDelete, setFilesToDelete] = React.useState([]);
  const [deletingFiles, setDeletingFiles] = React.useState(false);

  React.useEffect(() => {
    const getFileLinks = async () => {
      const data = await (await fetch(`${API_URL}/list-files`)).json();
      setServerFiles(data);
    };
    getFileLinks();
  }, []);

  const confirmRefreshCrknData = () => {
    Modal.confirm({
      title: 'Are you sure you want to update the CRKN data?',
      icon: <ExclamationCircleOutlined />,
      content: 'This process can take some time.',
      async onOk() {
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
          const data = await res.json();
          setSuccessMsg('Succesfully updated CRKN sheets.');
          if (data.files) setServerFiles(data.files);
        } else if (res.status === 401) {
          sessionStorage.removeItem('adminKey');
          setLoginMessage('Admin session has expired. Please login again.');
          setLoggedIn(false);
        } else {
          setError('An unexpected error occurred.');
        }
      },
    });
  };

  const confirmUploadFile = () => {
    Modal.confirm({
      title: `Are you sure you want to upload: "${uploadedFile.name}"?`,
      icon: <ExclamationCircleOutlined />,
      content: `This process can take some time. Any file with the same name as "${uploadedFile.name}" will be overwritten.`,
      async onOk() {
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

        let data = null;
        try {
          data = await res.json();
        } catch (error) {
          console.error('Response data was not in JSON format.');
        }

        setUploadingFile(false);
        if (res.status === 200) {
          setSuccessMsg('Succesfully uploaded spreadsheet.');
          if (data.files) setServerFiles(data.files);
        } else if (res.status === 401) {
          sessionStorage.removeItem('adminKey');
          setLoginMessage('Admin session has expired. Please login again.');
          setLoggedIn(false);
        } else {
          setError(data.error ?? 'An unexpected error occurred.');
        }
      },
    });
  };

  const confirmDeleteFiles = () => {
    Modal.confirm({
      title: `Are you sure you want to delete files?"`,
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          <h4>The following files will be deleted:</h4>
          <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
            {filesToDelete.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </>
      ),
      async onOk() {
        setError(undefined);
        setSuccessMsg(undefined);
        setDeletingFiles(true);
        const formData = new FormData();
        formData.append('filesToDelete', JSON.stringify(filesToDelete));
        formData.append('adminKey', sessionStorage.getItem('adminKey'));
        const res = await fetch(`${API_URL}/admin/delete-files`, {
          method: 'Post',
          body: formData,
        });

        setDeletingFiles(false);
        if (res.status === 200) {
          const data = await res.json();
          setSuccessMsg('Succesfully deleted spreadsheet(s).');
          setFilesToDelete([]);
          if (data.files) setServerFiles(data.files);
        } else if (res.status === 401) {
          sessionStorage.removeItem('adminKey');
          setLoginMessage('Admin session has expired. Please login again.');
          setLoggedIn(false);
        } else {
          setError('An unexpected error occurred.');
        }
      },
    });
  };

  return (
    <>
      <Divider>File Modification</Divider>
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
      <Row style={{ alignItems: 'center' }}>
        <Col style={{ marginBottom: '20px' }} span={24} md={12}>
          <h3>Refresh CRKN Data:</h3>
          <Button
            type='primary'
            size='large'
            onClick={confirmRefreshCrknData}
            loading={crknRefreshing}
          >
            Refresh CRKN Data
          </Button>
        </Col>
        <Col style={{ marginBottom: '20px' }} span={24} md={12}>
          <h3>Upload Spreadsheet:</h3>
          <Space wrap={true}>
            <input
              type='file'
              accept='.xlsx'
              onChange={(e) => {
                setUploadedFile(e.target.files[0]);
              }}
            />
            <Button
              type='primary'
              size='large'
              onClick={confirmUploadFile}
              disabled={!uploadedFile}
              loading={uploadingFile}
            >
              Upload file
            </Button>
          </Space>
        </Col>
      </Row>
      <Row>
        <Col style={{ marginBottom: '20px' }} span={24} md={12}>
          <h3>Delete Files:</h3>
          <Row>
            <Checkbox.Group
              value={filesToDelete}
              onChange={(checkedValues) => setFilesToDelete(checkedValues)}
            >
              <Space direction='vertical'>
                {serverFiles.map((f) => {
                  return (
                    <Checkbox key={f} value={f}>
                      {f}
                    </Checkbox>
                  );
                })}
              </Space>
            </Checkbox.Group>
          </Row>
          <Row>
            <Button
              type='primary'
              size='large'
              danger
              onClick={confirmDeleteFiles}
              disabled={filesToDelete.length === 0}
              loading={deletingFiles}
              style={{ marginTop: '10px' }}
            >
              Delete files
            </Button>
          </Row>
        </Col>
      </Row>
    </>
  );
}
