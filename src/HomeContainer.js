import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "./auth";
import {NavBar} from "./navbar.js"
export const HomeContainer = ({
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => {
        
          return (
            <div> 
              <NavBar {... props} />
              <Component {...props} />
            </div>
          );
        
                 
      }}
    />
  );
};
