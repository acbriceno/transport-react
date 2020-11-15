import React, {useRef, useState} from "react";
import auth from "./auth";
import roleManager from './RoleManager'
import Toast from 'react-bootstrap/Toast'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {gql, useMutation} from '@apollo/client'

const  createStopM = gql `
    mutation createStop($stop: StopInput!){
      createStop(stop: $stop){
        status
        code
        ... on StopResponse{
          stop {
            id
            name
            location
          }
        }

      }
    }
  `

 var initialState = {
   lat: '',
   lon: '',
   name: '',
   location: '',
   type: ''
 }

 const resetState = {
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
  const [errors, setErrors] = useState('')
   const [show, setShow] = useState(false)


  const [createStop, { loading, error, data }] = useMutation(createStopM, {
    onCompleted: (data) =>{
      if(data !== undefined ){
       console.log(data)
        if(data.createStop === null){
        }else{
            if(!data.createStop.status){
            return (<p> Stop not created </p>)
          }
          initialState = resetState
          setState(initialState)
          setShow(true)
        }

      }

    },
    onError: (error) => console.error("Error", error)
  })

  if(loading){return (<p> Loading... </p>)}
  
  async function handleCreateStop() {
    //event.preventDefault();
      console.log(state)  
    createStop({ variables: {stop: { lat: parseFloat(state.lat), lon: parseFloat(state.lon), name: state.name, location: state.location, type: state.type }} });
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

    if(state.type === 'Select' || state.type === ''){return}
    setErrors('')

    handleCreateStop()
  }


  const testSubmit = e =>{
    e.preventDefault()
   createStop({ variables: {stop: { lat: 20.359687, lon: "18.165895", name: "Placencia Bus Terminal", location: "Stann Creek", type: "TERMINAL" }} });
  
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

