import React from 'react';
import { API_URL } from '../../util';
import { Row, Col, Button, Alert, Divider, Modal, Space, Checkbox } from 'antd';
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
