import React from 'react';
import { API_URL } from '../../util';
import { Row, Col, Button, Alert, Divider, Modal, Form, Input } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function StyleConfigurationSection(props) {
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
