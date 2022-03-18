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
} from 'antd';
import { ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import Header from '../components/header';
import AdminSetupForm from '../components/admin/setup-form';
import AdminLoginForm from '../components/admin/login-form';
import StyleContext from '../util/styleContext';

export default function Admin() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [adminSetup, setAdminSetup] = React.useState(false);
  const [loadingPage, setLoadingPage] = React.useState(true);
  const [loginMessage, setLoginMessage] = React.useState('');
  const styleConfig = React.useContext(StyleContext);

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
    <Layout>
      <Header />
      <Layout.Content style={{ padding: '0 2vw' }}>
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
            {loggedIn && (
              <AdminControls
                setLoggedIn={setLoggedIn}
                setLoginMessage={setLoginMessage}
              />
            )}
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
}

function AdminControls(props) {
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
        onClick={confirmRefreshCrknData}
        loading={crknRefreshing}
      >
        Refresh CRKN data
      </Button>
      <Divider />
      <input
        type='file'
        accept='.xlsx, .csv, .tsv'
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
        style={{ marginTop: '10px' }}
      >
        Upload file
      </Button>
      <Divider />
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
    </div>
  );
}
