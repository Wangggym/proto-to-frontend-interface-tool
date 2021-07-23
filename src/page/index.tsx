import React, { useState } from 'react';
import { Input, message, Tabs } from 'antd';
import { parseProto } from '../pb_to_ts';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styles from './index.less';

const { TabPane } = Tabs;
const { TextArea } = Input;

const App: React.FC = () => {
  const [methods, setMethods] = useState<string>();
  const [types, setTypes] = useState<string>();

  const handleChange = (v: string) => {
    const { allMethods, allTypes } = parseProto(v);
    setMethods(allMethods);
    setTypes(allTypes);
  };

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
