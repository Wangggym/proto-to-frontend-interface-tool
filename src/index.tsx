import React from "react";
import ReactDOM from "react-dom";
import { Button } from "antd";
import styles from "./index.less";


ReactDOM.render(
  <div className={styles.app}>
    <a>123</a>
    <Button type="primary">hello webpack !!!123</Button>{" "}
  </div>,
  document.getElementById("root")
);
