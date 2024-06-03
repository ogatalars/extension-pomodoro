import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// Se você deseja medir o desempenho no seu aplicativo, passe uma função
// para registrar resultados (por exemplo: reportWebVitals(console.log))
// ou envie para um endpoint de análise. Saiba mais: https://bit.ly/CRA-vitals
reportWebVitals();

export {}; // Esta linha transforma o arquivo em um módulo
