import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

import "./style/classes.css";
// @ts-ignore
import "./style/index.css";
// @ts-ignore
import "./App.css";
import "./style/applies.css";

// 导入i18n配置
import i18n from "./i18n/i18n";

// @ts-ignore
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

// 等待 i18n 初始化完成后再渲染应用
const renderApp = async () => {
  try {
    // 等待 i18n 初始化完成
    await i18n.init();
    root.render(<App />);
  } catch (error) {
    console.error('Failed to initialize i18n:', error);
    // 即使初始化失败也要渲染应用，使用默认语言
    root.render(<App />);
  }
};

renderApp();
reportWebVitals();