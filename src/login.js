import React, {useRef, useState} from "react";
import auth from "./auth";
import roleManager from './RoleManager'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Jumbotron from 'react-bootstrap/Jumbotron'
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
const initialState = {
  email: '',
  password: ''
}
export const LoginPage = props => {
 if(auth.getRole() != null){
   props.history.push(roleManager.getStartingRoute(auth.getRole())) 
 }


  const [state, setState] = useState(initialState)
  const [errors, setErrors] = useState('')

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
  


 const handleSubmit = e => {
    e.preventDefault()

    for(let key in state){
      if(state[key] === ''){
        setErrors(`You must provide the input ${key}`)
        console.log(errors)
        return
      }
    
    }

    setErrors('')
   console.log("before login")

    handleLogin()
  }

  const handleInput = e => {
    const inputName = e.currentTarget.name
    const value = e.currentTarget.value
    setState(prev => ({...prev, [inputName]: value}))
  }
 
 //baseLogin({ variables: { email: "tester@admin.com", password: "12345" } });


  async function handleLogin() {
    console.log("in query")
     baseLogin({ variables: { email: state.email, password: state.password } });

  }




 
  return (
    <>


 <Jumbotron>
      <h2 className="text-center">Belize Transport Online</h2>

    <div className="col-md-4 col-md-offset-4">
    { errors && ( <p>{errors}</p>)
    }
      <form noValidate>
        <Form.Group controlId="v">
          <Form.Label>E-mail</Form.Label>
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control  size="sm" required type="email" placeholder="" name="email" value={state.email} onChange={handleInput} />
          <Form.Label>Password</Form.Label>
          <Form.Control size="sm" type="password"  placeholder="" name="password" value={state.password} onChange={handleInput} />
          </Form.Group>
          <Button size="sm" onClick={e => handleSubmit(e)}>Login</Button>
          <p></p>
          

      </form>
    </div>


    </Jumbotron>
    </>
  );
};

