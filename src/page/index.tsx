import React, { useState, useEffect, useMemo } from 'react';
import { Checkbox, Input, message, Tabs } from 'antd';
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

const methodsDependence = (methods: string, disabledDependence: boolean) =>
  disabledDependence ? methods : `import request from '../utils/request';\n\n${methods}`;

const typesDependence = (types: string, disabledDependence: boolean) =>
  disabledDependence ? types : `declare namespace API {\n${types}\n}`;

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
  const [disabledDependence, setDisabledDependence] = useState<boolean>(false);

  const handleChange = (v: string) => {
    setInputValue(v);
  };

  const handleChangeDisabledDependence = (v: boolean) => {
    setDisabledDependence(v);
  };

  useEffect(() => {
    if (inputValue) {
      try {
        const { allMethods, allTypes, allMethodsAttr } = parseProto(inputValue);
        setMethods(allMethods);
        setTypes(allTypes);
        const methdsAttr: MethodsAttr = flatMapDeep(allMethodsAttr);
        console.log(methdsAttr);
        const mData = map(methdsAttr, ({ method, methodName, notes, url }) => {
          const ts = mockResponse(`syntax = "proto3";${inputValue}`, methodName!);
          const aa = JSON.stringify(ts, null, 4);
          return ` /* ${notes?.trim()} */\n '${method} ${url}': ${aa},\n`;
        }).join('');
        setMockData(
          `/* Create Time: ${new Date().toLocaleDateString()} */
module.exports = {
${mData}};`,
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        message.warn(`格式不正确`);
      }
    }
  }, [inputValue]);

  const { cacheTypes, cacheMethdos } = useMemo(() => {
    return {
      cacheMethdos: methodsDependence(methods!, disabledDependence),
      cacheTypes: typesDependence(types!, disabledDependence),
    };
  }, [methods, types, disabledDependence]);

  return (
    <div className={styles.warpper}>
      <Tabs size="large">
        <TabPane tab="PB Converter" key="1">
          <div>
            <Checkbox onChange={(e) => handleChangeDisabledDependence(e.target.checked)}>
              disabledDependence
            </Checkbox>
          </div>
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
                  text={cacheMethdos!}
                  onCopy={() => message.success('copy successfully')}
                >
                  <button>copy to clipboard</button>
                </CopyToClipboard>
                <TextArea value={cacheMethdos} />
              </div>
              <div className={styles.item}>
                <label>Interface</label>
                <CopyToClipboard
                  text={cacheTypes!}
                  onCopy={() => message.success('copy successfully')}
                >
                  <button>copy to clipboard</button>
                </CopyToClipboard>
                <TextArea value={cacheTypes} />
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
