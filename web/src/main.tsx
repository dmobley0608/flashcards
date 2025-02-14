import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { ClerkProvider } from "@clerk/clerk-react";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});


const PUBLISHABLE_KEY = "pk_test_YXNzdXJlZC1raXdpLTI1LmNsZXJrLmFjY291bnRzLmRldiQ"

if(!PUBLISHABLE_KEY){
  throw new Error('Missing PUBLISHABLE KEY')
}



createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
        </ClerkProvider>
      </ApolloProvider>
    </BrowserRouter>
  </StrictMode>
);
