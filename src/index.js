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
import HomePage from './home'
import GetPassPage from './getPass'
import PassesPage from './Passes'
import {CommuterContainer} from './CommuterContainer'
import {HomeContainer} from './HomeContainer'
import {LoginContainer} from './LoginContainer'
import {RegisterContainer} from './RegisterContainer'
import { onError } from "@apollo/client/link/error";
import {ApolloLink} from "apollo-link"
const httpLink = createHttpLink({uri: 'http://192.168.2.212:5002', credentials: 'include'}) 

var errorSwitch = true

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

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) {
    errorSwitch = false
    load()
    console.log(`[Network error]: ${networkError}`);
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink.concat(httpLink)]),  
  cache: new InMemoryCache()
});



function AppController() {
  return (
    <div className="AppController">
      <Switch>
       <HomeContainer exact path="/" component={HomePage}/> 
        <RegisterContainer exact path ="/register" component={RegisterPage}/>
        <LoginContainer exact path="/login" component={LoginPage} />
        <AdminContainer exact path="/admin" component={Admin}/>
        <CommuterContainer exact path="/getpass" component={GetPassPage}/>
     <CommuterContainer exact path="/passes" component={PassesPage}/>
       <OperatorContainer exact path="/operator" component={Operator}/>
     // <ProtectedRoute exact path="/admin" component={Admin} />
        <Route path="*" component={() => "404 NOT FOUND"} />
      </Switch>
    </div>
  );
}



function ErrorAppController() {
  return (
    <div className="ErrorAppController">
      <Switch>
       <Route exact path="/" component={() => "Server Down"}/> 
       <Route path="*" component={() => "404 NOT FOUND Server Down"} />
      </Switch>
    </div>
  );
}

const load = () =>{
if(errorSwitch){
ReactDOM.render(
  <ApolloProvider client={client}>
  <BrowserRouter>
    <AppController />
  
  </BrowserRouter>
  </ApolloProvider>,
  rootElement
);
}else{
ReactDOM.render(
  <ApolloProvider client={client}>
  <BrowserRouter>
    <ErrorAppController />
  
  </BrowserRouter>
  </ApolloProvider>,
  rootElement
);

}

}
const rootElement = document.getElementById("root");
load()

