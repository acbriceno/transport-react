import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { LoginPage } from "./login";
import { ProtectedRoute } from "./protectedroute";
import { BrowserRouter, Route, Switch } from "react-router-dom";



const client = new ApolloClient({
  link: new HttpLink({
  uri: 'http://localhost:5002'
  }),
  cache: new InMemoryCache()
});







function AppController() {
  return (
    <div className="AppController">
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <ProtectedRoute exact path="/app" component={App} />
        <Route path="*" component={() => "404 NOT FOUND"} />
      </Switch>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <ApolloProvider client={client}>
  <BrowserRouter>
    <AppController />
  </BrowserRouter>
  </ApolloProvider>,
  rootElement
);



