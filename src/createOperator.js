import React, {useRef, useState} from "react";
import auth from "./auth";
import roleManager from './RoleManager'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {gql, useMutation} from '@apollo/client'
const  createOperatorBareBonesM = gql `
    mutation CreateBareBones($lat: String!, $lon: String!, $name: String!, $location: String!, $type: StopType!){
      createStop(lat: $lat, lon: $lon, name: $name, location: $location, type: $type){
        status
        code
        ... on StopResponse{
          id
          name
          lat 
          lon
          type
          location
        }

      }
    }
  `

 const initialState = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  operatorLicenseNo: '',
  operatorName: ''
 }




export const CreateOperatorPage = props => {
// if(auth.getRole() != null){
  // props.history.push(roleManager.getStartingRoute(auth.getRole())) 
// }
  const [state, setState] = useState(initialState)
  const [error, setError] = useState('')


  const [createStop, { loading, gqlError, data }] = useMutation(createOperatorBareBonesM, {
    onCompleted: (data) =>{
      if(data !== undefined ){
       console.log(data)
        if(data.createStop === null){
        }else{
        
        }

      }

    },
    onError: (gqlError) => console.error("Error", gqlError)
  })

  if(loading){return (<p> Loading... </p>)}
  
  async function handleCreateOperator() {
    //event.preventDefault();
      console.log(state)  
    //createStop({ variables: { lat: state.lat, lon: state.lon, name: state.name, location: state.location, type: state.type } });
  }

  const handleSubmit = e => {
    e.preventDefault()

    for(let key in state){
      if(state[key] === ''){
        setError(`You must provide the input ${key}`)
        console.log(error)
        return
      }
    
    }

    setError('')

    handleCreateOperator()
  }

  const handleInput = e => {
    const inputName = e.currentTarget.name
    const value = e.currentTarget.value
    setState(prev => ({...prev, [inputName]: value}))
  }
 
  return (
    <>
    <div className="col-md-4 col-md-offset-4">
    { error && ( <p>{error}</p>)
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
    </>
  );
};

