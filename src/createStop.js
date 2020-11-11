import React, {useRef, useState} from "react";
import auth from "./auth";
import roleManager from './RoleManager'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {gql, useMutation} from '@apollo/client'
const  createStopM = gql `
    mutation CreateStop($lat: String!, $lon: String!, $name: String!, $location: String!, $type: StopType!){
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
   lat: '',
   lon: '',
   name: '',
   location: '',
   type: ''
 }


export const CreateStopPage = props => {
// if(auth.getRole() != null){
  // props.history.push(roleManager.getStartingRoute(auth.getRole())) 
// }
  const [state, setState] = useState(initialState)
  const [error, setError] = useState('')


  const [createStop, { loading, gqlError, data }] = useMutation(createStopM, {
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
  
  async function handleCreateStop() {
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

    if(state.type === 'Select' || state.type === ''){return}
    setError('')

    handleCreateStop()
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


  
        <Form.Group controlId="validationCustom01">
          <Form.Label>Stop Name</Form.Label>
 <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control  size="sm" required type="text" placeholder="" name="name" value={state.name} onChange={handleInput} />
          <Form.Label>Latitude</Form.Label>
          <Form.Control size="sm" type="number"  placeholder="eg: 18.146891" name="lat" value={state.lat} onChange={handleInput} />
          <Form.Label>Longitude</Form.Label>
          <Form.Control size="sm" type="number" placeholder="21.569815" name="lon" value={state.lon} onChange={handleInput} />
          <Form.Label>Location</Form.Label>
          <Form.Control size="sm" type="text" placeholder="" name="location" value={state.location} onChange={handleInput} />  
          <Form.Label>Stop Type</Form.Label>
           <Form.Control size="sm" as="select" name="type" value={state.type} custom onChange={handleInput} >
              <option>Select</option>
              <option>TERMINAL</option>
              
            </Form.Control>
    </Form.Group>
        <Button size="sm" onClick={e => handleSubmit(e)}>Create Stop</Button>
      </form>
    </div>
    </>
  );
};

