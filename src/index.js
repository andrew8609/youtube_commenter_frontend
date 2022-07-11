import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { getFromStorage } from "./utils/storage";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: "https://fd03633d9ce543b89c313e9f71bd5966@o613569.ingest.sentry.io/5749259",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// get the authentication token from local storage if it exists
const token = getFromStorage("token") || getFromStorage("user_token");

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_BACKEND_URL}/graphql`,
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${token ? token : ""}`,
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
