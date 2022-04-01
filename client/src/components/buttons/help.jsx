import React from 'react';
import { Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

export default function HelpButton({ style }) {
  return (
    <Button
      icon={<QuestionCircleOutlined />}
      onClick={() =>
        window.open(
          'https://github.com/UPEI-Android/library-journal-entitlements-project/wiki'
        )
      }
      style={style}
    >
      Help
    </Button>
  );
}
