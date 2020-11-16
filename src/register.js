import React, {useRef, useState} from "react";
import auth from "./auth";
import roleManager from './RoleManager'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Toast from 'react-bootstrap/Toast'
import {gql, useMutation} from '@apollo/client'

const  signupM = gql `
    mutation signup($user: UserInput!, $securityqa: [SecurityQAInput!]!){
      signup(user: $user, securityqa: $securityqa){
          id
          role{
            id
            role
          }
        
        }
    }
  `



 var initialState = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
   sq1: "",
   sq2: "",
   sq3: "",
   sqa1: "",
   sqa2: "",
   sqa3: "",
   role: "COMMUTER"
 }

const resetState = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  sq1: "",
  sq2: "",
  sq3: "",
  sqa1: "",
  sqa2: "",
  sqa3: "",
  role: "COMMUTER"
 }

const securityQuestions = [
  "Cat Name?", "Dog Name?", "Favorite Food","Chilhhood Dream?"
]

//needs for implement reset state function to allow continues use of the form after the ui has been cleared



export const RegisterPage = props => {
  if(auth.getRole() != null){
    props.history.push(roleManager.getStartingRoute(auth.getRole())) 
 }
  const [state, setState] = useState(initialState)
  const [errors, setErrors] = useState('')
  const [show, setShow] = useState(false)

  const [signup, { loading, error, data }] = useMutation(signupM, {
    onCompleted: (data) =>{
      if(data !== undefined ){
       console.log(data)
        if(data.signup === null){
        }else{
          props.history.push("/login") 

        }

      }

    },
    onError: (error) => console.error("Error",error)
  })

  if(loading){return (<p> Loading... </p>)}
  
  async function handleSignup() {
    //event.preventDefault();
      console.log(state) 


    signup({
      variables: {
        user:{
          email: state.email,
          password: state.password,
          firstName: state.firstName,
          lastName: state.lastName,
          role:{
            role: state.role
          },
          twoFactorAuth:{
            email: state.email,
            active: "EMAIL"
          }
        },
        securityqa: [
          {
            question: state.sq1,
            answer: state.sqa1
          },
          {
            question: state.sq2,
            answer: state.sqa2
          },
          {
            question: state.sq3,
            answer: state.sqa3
          }
        ]

      }

    })
   //createBareOperator({ variables: {user:{email: state.email, password: state.password, firstName: state.firstName, lastName: state.lastName, role:{role: state.role} }, operator:{name: state.operatorName, licenseNo: state.operatorLicenseNo}} });
  }

  const handleSubmit = e => {
    e.preventDefault()

    for(let key in state){
      if(state[key] === ''){
        setErrors(`You must provide the input ${key}`)
        console.log(errors)
        return
      }
    
    }
    if(state.sq1 === "Select..."  || state.sq2 === "Select..." || state.sq3 === "Select..." ) {
    setErrors("Select... is not a viable option")
      return}
    setErrors('')

    handleSignup()
  }

  const handleInput = e => {
    const inputName = e.currentTarget.name
    const value = e.currentTarget.value
    setState(prev => ({...prev, [inputName]: value}))
  }


  const handleLoginPage = e => {

  props.history.push("login") 

    
  }


  console.log(state) 
  const securityQuestionsList = securityQuestions.map((securityQuestion, idx) => 
   <option key={idx}>{securityQuestion}</option>
  )

  return (
    <>
    <Jumbotron>
    <div className="row">
    <div className="col-md-4"></div>
    <div className="col-md-4">
    { errors && ( <p>{errors}</p>)
    }

    <h2>Regsiter</h2>

      <form noValidate>
        <Form.Group controlId="v">
          <Form.Label>E-mail</Form.Label>
 <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control  size="sm" required type="email" placeholder="" name="email" value={state.email} onChange={handleInput} />
          <Form.Label>Password</Form.Label>
          <Form.Control size="sm" type="password"  placeholder="" name="password" value={state.password} onChange={handleInput} />
          <Form.Label>First Name</Form.Label>
          <Form.Control size="sm" type="text" placeholder="" name="firstName" value={state.firstName} onChange={handleInput} />
          <Form.Label>Last Name</Form.Label>
          <Form.Control size="sm" type="text" placeholder="" name="lastName" value={state.lastName} onChange={handleInput} />          
          
          <Form.Label>Security Question One </Form.Label>
          <Form.Control as="select" name="sq1" value={state.sq1} onChange={handleInput}>
            <option>Select...</option>
            {securityQuestionsList}
          </Form.Control>
          <Form.Label>Security Question Answer One</Form.Label>

          <Form.Control size="sm" type="text" placeholder="" name="sqa1" value={state.sqa1} onChange={handleInput} />  
              
         <Form.Label>Security Question Two </Form.Label>
          <Form.Control as="select" name="sq2" value={state.sq2} onChange={handleInput}>
            <option>Select...</option>
            {securityQuestionsList}
          </Form.Control>
          <Form.Label>Security Question Answer Two</Form.Label>

          <Form.Control size="sm" type="text" placeholder="" name="sqa2" value={state.sqa2} onChange={handleInput} />  

        <Form.Label>Security Question Three </Form.Label>
          <Form.Control as="select" name="sq3" value={state.sq3} onChange={handleInput}>
            <option>Select...</option>
            {securityQuestionsList}
          </Form.Control>
          <Form.Label>Security Question Answer Three</Form.Label>

          <Form.Control size="sm" type="text" placeholder="" name="sqa3" value={state.sqa3} onChange={handleInput} />  
        </Form.Group>
        <Button size="sm" onClick={e => handleSubmit(e)}>Register</Button>
      </form>
    <br></br>
    <Button size="sm" onClick={e => handleLoginPage(e)}>Login Page</Button>

     </div>

        </div>
    </Jumbotron>
    </>
  );
};

