import React, { useState, useEffect } from 'react';
import { Input, message, Tabs } from 'antd';
import { parseProto } from '../pb_to_ts';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styles from './index.less';

const defaultFile = `
syntax = "proto3";
option go_package = "ccc/aaa";
service MyService {
  // POST /aefw/few/fwe --> 这里是注释
    rpc MyMethod (MyRequest) returns (MyResponse);
}

message MyRequest {
  // 这里是注释
    string path = 1;
}

message MyResponse {
  // 这里是注释
    int32 status = 1;
}
  `;

const { TabPane } = Tabs;
const { TextArea } = Input;

const App: React.FC = () => {
  const [methods, setMethods] = useState<string>();
  const [types, setTypes] = useState<string>();
  const [inputValue, setInputValue] = useState<string>(defaultFile);

  const handleChange = (v: string) => {
    setInputValue(v);
  };

  useEffect(() => {
    if (inputValue) {
      try {
        const { allMethods, allTypes } = parseProto(inputValue);
        setMethods(allMethods);
        setTypes(allTypes);
      } catch (error) {
        console.log(error);
        message.warn(`格式不正确`);
      }
    }
  }, [inputValue]);

  return (
    <div className={styles.warpper}>
      <Tabs size="large">
        <TabPane tab="PB Converter" key="1">
          <div className={styles.content}>
            <div>
              <div className={styles.item}>
                <label>Protocol buffer</label>

                <TextArea
                  autoSize={{ minRows: 22 }}
                  onChange={(v) => handleChange(v.target.value)}
                  value={inputValue}
                />
              </div>
            </div>
            <div>
              <div className={styles.item}>
                <label>Request</label>
                <CopyToClipboard
                  text={methods!}
                  onCopy={() => message.success('copy successfully')}
                >
                  <button>copy to clipboard</button>
                </CopyToClipboard>
                <TextArea value={methods} />
              </div>
              <div className={styles.item}>
                <label>Interface</label>
                <CopyToClipboard text={types!} onCopy={() => message.success('copy successfully')}>
                  <button>copy to clipboard</button>
                </CopyToClipboard>
                <TextArea value={types} />
              </div>
            </div>
            <div>
              <div className={styles.item}>
                <label>Mock</label>
                <TextArea />
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default App;
