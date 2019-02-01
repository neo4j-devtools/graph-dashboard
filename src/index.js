import "./polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import logger from "redux-logger";
import reducers from "./reducers";
import "./index.css";
import App from "./App";
// disable ServiceWorker
// import registerServiceWorker from './registerServiceWorker';
const store = createStore(reducers, applyMiddleware(logger));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);
// disable ServiceWorker
// registerServiceWorker();
