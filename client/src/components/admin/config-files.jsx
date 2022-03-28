import React from 'react';
import { API_URL } from '../../util';
import {
  Row,
  Col,
  Button,
  Alert,
  Divider,
  Modal,
  Space,
  Checkbox,
  Input,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function FileModificationSection(props) {
  const { setLoggedIn, setLoginMessage } = props;
  const [error, setError] = React.useState(undefined);
  const [successMsg, setSuccessMsg] = React.useState(undefined);
  const [crknRefreshing, setCrknRefreshing] = React.useState(false);
  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [uploadingFile, setUploadingFile] = React.useState(false);
  const [serverFiles, setServerFiles] = React.useState([]);
  const [filesToDelete, setFilesToDelete] = React.useState([]);
  const [deletingFiles, setDeletingFiles] = React.useState(false);
  const [wipingDB, setWipingDB] = React.useState(false);
  const [school, setSchool] = React.useState('');
  const [changingSchool, setChangingSchool] = React.useState(false);
  const [crknURL, setCrknURL] = React.useState('');
  const [changingCrknURL, setChangingCrknURL] = React.useState('');

  React.useEffect(() => {
    const getFileLinks = async () => {
      try {
        const data = await (await fetch(`${API_URL}/list-files`)).json();
        const currentSchool = await (
          await fetch(
            `${API_URL}/admin/get-school?adminKey=${sessionStorage.getItem(
              'adminKey'
            )}`
          )
        ).json();
        const url = await (
          await fetch(
            `${API_URL}/admin/get-crkn-url?adminKey=${sessionStorage.getItem(
              'adminKey'
            )}`
          )
        ).json();
        setCrknURL(url);
        setSchool(currentSchool);
        setServerFiles(data);
      } catch (error) {
        setError('An unexpected error occured.');
      }
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
      title: `Are you sure you want to delete files?`,
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

  const confirmWipeDatabase = () => {
    Modal.confirm({
      title: `Are you sure you want to wipe the database?"`,
      icon: <ExclamationCircleOutlined />,
      content:
        'This will delete all the files as well as all the records from the database.',
      async onOk() {
        setError(undefined);
        setSuccessMsg(undefined);
        setWipingDB(true);
        const res = await fetch(
          `${API_URL}/admin/wipe-database?adminKey=${sessionStorage.getItem(
            'adminKey'
          )}`
        );

        setWipingDB(false);
        if (res.status === 200) {
          setSuccessMsg('Succesfully wiped database.');
          setServerFiles([]);
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

  const confirmChangeSchool = () => {
    Modal.confirm({
      title: `Are you sure you want to change the school?`,
      icon: <ExclamationCircleOutlined />,
      content:
        'This will delete all the files as well as all the records from the database. Ensure the school your changing to is spelt the same way as in the spreadsheets.',
      async onOk() {
        setError(undefined);
        setSuccessMsg(undefined);
        setChangingSchool(true);
        const formData = new FormData();
        formData.append('school', school);
        formData.append('adminKey', sessionStorage.getItem('adminKey'));
        const res = await fetch(`${API_URL}/admin/change-school`, {
          method: 'Post',
          body: formData,
        });

        setChangingSchool(false);
        if (res.status === 200) {
          setSuccessMsg('Succesfully changed schools.');
          setServerFiles([]);
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

  const confirmChangeURL = () => {
    Modal.confirm({
      title: `Are you sure you want to change the CRKN URL?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This will change the URL used to fetch CRKN files.',
      async onOk() {
        setError(undefined);
        setSuccessMsg(undefined);
        setChangingCrknURL(true);
        const formData = new FormData();
        formData.append('url', crknURL);
        formData.append('adminKey', sessionStorage.getItem('adminKey'));
        const res = await fetch(`${API_URL}/admin/change-crkn-url`, {
          method: 'Post',
          body: formData,
        });

        setChangingCrknURL(false);
        if (res.status === 200) {
          setSuccessMsg('Succesfully changed CRKN URL.');
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
      <Row gutter={20} style={{ alignItems: 'center' }}>
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
      <Row gutter={20}>
        <Col style={{ marginBottom: '20px' }} span={24} md={12}>
          <h3>Wipe Database:</h3>
          <Button
            type='danger'
            size='large'
            onClick={confirmWipeDatabase}
            loading={wipingDB}
          >
            Wipe Database
          </Button>
        </Col>
        <Col style={{ marginBottom: '20px' }} span={24} md={12}>
          <h3>Change School:</h3>
          <Input
            size='large'
            value={school}
            onChange={(e) => setSchool(e.target.value)}
          />
          <Button
            type='primary'
            size='large'
            loading={changingSchool}
            onClick={confirmChangeSchool}
            style={{ marginTop: '10px' }}
          >
            Change School
          </Button>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col style={{ marginBottom: '20px' }} span={24} md={12}>
          <h3>Change CRKN File URL:</h3>
          <Input
            size='large'
            value={crknURL}
            onChange={(e) => setCrknURL(e.target.value)}
          />
          <Button
            type='primary'
            size='large'
            loading={changingCrknURL}
            onClick={confirmChangeURL}
            style={{ marginTop: '10px' }}
          >
            Change URL
          </Button>
        </Col>
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
