import React from 'react';
import ReactDOM from 'react-dom';
import Admin from './Admin';
import Operator from './Operator';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, createHttpLink } from '@apollo/client';
import './style.css'
import { LoginPage } from "./login";
import { ProtectedRoute } from "./protectedroute";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {AdminContainer} from './AdminContainer'
import { setContext } from '@apollo/client/link/context';
import {OperatorContainer} from './OperatorContainer'
import {RegisterPage} from './register'
const httpLink = createHttpLink({uri: 'http://192.168.2.212:5002', credentials: 'include'}) 

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      "x-token": token ? `${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});




function AppController() {
  return (
    <div className="AppController">
      <Switch>
        
        <Route exact path ="/register" component={RegisterPage}/>
        <Route exact path="/login" component={LoginPage} />
        <AdminContainer exact path="/admin" component={Admin}/> 
       <OperatorContainer exact path="/operator" component={Operator}/>
     // <ProtectedRoute exact path="/admin" component={Admin} />
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



