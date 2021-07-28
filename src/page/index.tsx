import React, { useState, useEffect } from 'react';
import { Input, message, Tabs } from 'antd';
import { parseProto, mockResponse } from '../pb_to_ts';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styles from './index.less';
import { flatMapDeep, map } from 'lodash';

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

type MethodsAttr = {
  method?: 'GET' | 'POST';
  methodName?: string;
  notes?: string;
  url?: string;
}[];

const App: React.FC = () => {
  const [methods, setMethods] = useState<string>();
  const [types, setTypes] = useState<string>();
  const [mockData, setMockData] = useState<string>();
  const [inputValue, setInputValue] = useState<string>(defaultFile);

  const handleChange = (v: string) => {
    setInputValue(v);
  };

  useEffect(() => {
    if (inputValue) {
      try {
        const { allMethods, allTypes, allMethodsAttr } = parseProto(inputValue);
        setMethods(allMethods);
        setTypes(allTypes);
        const methdsAttr: MethodsAttr = flatMapDeep(allMethodsAttr);
        const mData = map(methdsAttr, ({ method, methodName, notes, url }) => {
          const ts = mockResponse(`syntax = "proto3";${inputValue}`, methodName!);
          const aa = JSON.stringify(ts, null, 4);
          return ` /* ${notes?.trim()} */\n '${method} ${url}': (req: Request, res: Response) => {\n res.json(mock(${aa}));\n},\n`;
        }).join('');
        setMockData(
          `/* Create Time: ${new Date().toLocaleDateString()} */
import { Request, Response } from 'express';
import { mock } from 'mockjs';
export default {
${mData}};`,
        );
      } catch (error) {
        // eslint-disable-next-line no-console
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
                <CopyToClipboard
                  text={mockData!}
                  onCopy={() => message.success('copy successfully')}
                >
                  <button>copy to clipboard</button>
                </CopyToClipboard>
                <TextArea value={mockData} />
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default App;
