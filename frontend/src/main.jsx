import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import 'primeicons/primeicons.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <Provider store={store}>
        <App />
        {persistor.persist()}
      </Provider>
    </PrimeReactProvider>
  </React.StrictMode>
);