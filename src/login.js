import React, {useRef} from "react";
import auth from "./auth";
import roleManager from './RoleManager'
import {gql, useMutation} from '@apollo/client'
const  baseLoginM = gql `
    mutation BaseLogin($email: String!, $password: String!){
      baseLogin(email: $email, password: $password){
        token
        tokenExpiration
        user{
          id
          firstName
          lastName
          role{
            role
            id
          }
        }

      }
    }
  `

export const LoginPage = props => {
 if(auth.getRole() != null){
   props.history.push(roleManager.getStartingRoute(auth.getRole())) 
 }

  const [baseLogin, { loading, error, data }] = useMutation(baseLoginM, {
    onCompleted: (data) =>{
      if(data !== undefined ){
       console.log(data)
      if(data.baseLogin === null){
      }else{
        let authPayload = {
          token: data.baseLogin.token,
          tokenExpiration: data.baseLogin.tokenExpiration,
          user: data.baseLogin.user,
        }
        auth.setAuth(authPayload)
        props.history.push(roleManager.getStartingRoute(auth.getRole())) 
      }

  }

    },
    onError: (error) => console.error("Error", error)
  })

  if(loading){return (<p> Loading... </p>)}
  
  async function handleLogin(event) {
    event.preventDefault();
    baseLogin({ variables: { email: "tester@admin.com", password: "12345" } });
  }




 
  return (
    <>
    <div>
      <form >
        <button onClick={e => handleLogin(e)}>Login4Real</button>
      </form>
    </div>
    </>
  );
};

