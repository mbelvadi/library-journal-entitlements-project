import React from 'react';
import { Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import AppContext from '../../util/appContext';

export default function HelpButton({ style }) {
  const { helpUrl } = React.useContext(AppContext);

  return (
    <Button
      icon={<QuestionCircleOutlined />}
      onClick={() => window.open(helpUrl)}
      style={style}
    >
      Help
    </Button>
  );
}
