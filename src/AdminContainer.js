import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "./auth";
import {NavBar} from "./navbar.js"
const accessRole = "ADMIN"
export const AdminContainer = ({
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (auth.getRole() === accessRole) {
          return (
            <div> 
              <Component {...props} />
            </div>
          );
        } else {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location
                }
              }}
            />
          );
        }
      }}
    />
  );
};

