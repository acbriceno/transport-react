import React, {useRef, useState} from "react";
import auth from "./auth";
import roleManager from './RoleManager'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Toast from 'react-bootstrap/Toast'
import {gql, useMutation} from '@apollo/client'

const  createBareOperatorM = gql `
    mutation createBareOperator($user: BareBonesUserInput!, $operator: OperatorInput! ){
      createBareOperator(user: $user, operator: $operator){
        status
        code
        ... on BareOperatorResponse {
        operatorRole
        }
      }
    }
  `



 var initialState = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  operatorLicenseNo: '',
  operatorName: '',
  role: "OPERATOR"
 }

const resetState = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  operatorLicenseNo: '',
  operatorName: '',
  role: "OPERATOR"
 }

//needs for implement reset state function to allow continues use of the form after the ui has been cleared



export const CreateOperatorPage = props => {
// if(auth.getRole() != null){
  // props.history.push(roleManager.getStartingRoute(auth.getRole())) 
// }
  const [state, setState] = useState(initialState)
  const [errors, setErrors] = useState('')
  const [show, setShow] = useState(false)

  const [createBareOperator, { loading, error, data }] = useMutation(createBareOperatorM, {
    onCompleted: (data) =>{
      if(data !== undefined ){
       //console.log(data)
        if(data.createBareOperator === null){
        }else{
          if(!data.createBareOperator.status){
            return (<p> Operator no created </p>)
          }
          initialState = resetState
          setState(resetState)
          setShow(true)

        }

      }

    },
    onError: (error) => console.error("Error",error)
  })

  if(loading){return (<p> Loading... </p>)}
  
  async function handleCreateOperator() {
    //event.preventDefault();
      console.log(state)  
   createBareOperator({ variables: {user:{email: state.email, password: state.password, firstName: state.firstName, lastName: state.lastName, role:{role: state.role} }, operator:{name: state.operatorName, licenseNo: state.operatorLicenseNo}} });
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

    setErrors('')

    handleCreateOperator()
  }

  const handleInput = e => {
    const inputName = e.currentTarget.name
    const value = e.currentTarget.value
    setState(prev => ({...prev, [inputName]: value}))
  }
 
  return (
    <>
    <div className="row">
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
          <Form.Label>First Name</Form.Label>
          <Form.Control size="sm" type="text" placeholder="" name="firstName" value={state.firstName} onChange={handleInput} />
          <Form.Label>Last Name</Form.Label>
          <Form.Control size="sm" type="text" placeholder="" name="lastName" value={state.lastName} onChange={handleInput} />          
          <Form.Label>Operator Name</Form.Label>
          <Form.Control size="sm" type="text" placeholder="" name="operatorName" value={state.operatorName} onChange={handleInput} />  
          <Form.Row>
          <Form.Label>Operator License No</Form.Label>
          <Form.Control size="sm" type="text" placeholder="" name="operatorLicenseNo" value={state.operatorLicenseNo} onChange={handleInput} />  
</Form.Row>
              </Form.Group>
        <Button size="sm" onClick={e => handleSubmit(e)}>Create Operator</Button>
      </form>

     </div>

    <div className="col-md-4">
   <Toast onClose={() => setShow(false)} show={show} delay={2300} autohide>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded mr-2"
              alt=""
            />
            <strong className="mr-auto">Transport Management</strong>
            <small>Just now</small>
          </Toast.Header>
          <Toast.Body>Operator Account Created</Toast.Body>
        </Toast>

   

    </div>
    </div>
    </>
  );
};

