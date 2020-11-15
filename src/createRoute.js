import React, {useRef, useState} from "react";
import auth from "./auth";
import roleManager from './RoleManager'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Toast from 'react-bootstrap/Toast'
import {gql,useQuery, useMutation} from '@apollo/client'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
const  createOperatorRouteM = gql `
    mutation createOperatorRoute($route: RouteInput!, $schedule: [ScheduleInput!], $routeType: RouteType!, $intermediaries: [IntermediaryInput!]){
      createOperatorRoute(route: $route, schedule: $schedule, routeType: $routeType, intermediaries: $intermediaries){
        status
        code
        ... on OperatorRouteResponse {
        operatorRoute{
          id
        }
        }
      }
    }
  `
const stops = gql`
{
  stops{
    status
		code
    ... on StopsResponse{
      stops{
        id
        name
        lon
      }
    }
  }
}
`



 const initialState = {
   startingStop: '',
   endingStop: '',
   routeType: ''
 }

const resetState = {
  startingStop: '',
  endingStop: '',
  routeType: ''
}

//needs for implement reset state function to allow continues use of the form after the ui has been cleared



export const CreateRoutePage = props => {
// if(auth.getRole() != null){
  // props.history.push(roleManager.getStartingRoute(auth.getRole())) 
// }
  const [state, setState] = useState(initialState)
  const [errors, setErrors] = useState('')
  const [show, setShow] = useState(false)


  const {loading: stopsLoading, error: stopsError, data:stopsData} = useQuery(stops)
const [createOperatorRoute, { loading:createOperatorRouteLoading, error:createOperatorRouteError, data:createOperatorRouteData }] = useMutation(createOperatorRouteM, {
    onCompleted: (createOperatorRouteData) =>{
      if(createOperatorRouteData !== undefined ){
       //console.log(data)
        if(createOperatorRouteData.createOperatorRoute === null){
        }else{
          if(!createOperatorRouteData.createBareOperator.status){
            return (<p> Operator no created </p>)
          }
          setState(resetState)
          setShow(true)

        }

      }

    },
    onError: (error) => console.error("Error",error)
  })
 
  if(stopsLoading){return (<p> Loading... </p>)}
  if(stopsError) { return ( <p> error.. </p>)}
  console.log(stopsData)


  

  if(createOperatorRouteLoading){return (<p> Loading... </p>)}
  
  async function handleCreateRoute() {
    //event.preventDefault();
      console.log(state)  
   //createOperatorRoute({ variables: {user:{email: state.email, password: state.password, firstName: state.firstName, lastName: state.lastName, role:{role: state.role} }, operator:{name: state.operatorName, licenseNo: state.operatorLicenseNo}} });
  }

  const handleSubmit = e => {
    e.preventDefault()
    console.log(state)
    for(let key in state){
      if(state[key] === ''){
        setErrors(`You must provide the input ${key}`)
        console.log(errors)
        return
      }
    
    }

    setErrors('')

    //handleCreateRoute()
  }

  const handleInput = e => {
    const inputName = e.currentTarget.name
    const value = e.currentTarget.value
    setState(prev => ({...prev, [inputName]: value}))
  }
 
  const stopsList = stopsData.stops.stops.map((stop) =>
  <option key={stop.id} value={stop.id}>{stop.name}</option>  
 )


 let scheduleCounter = 0
  let intermediarycounter = 0
  const addSchedule = e => {

  }

  const addIntermediary = e => {

  }
  return (
    <>
 { errors && ( <p>{errors}</p>)
    }
<form>
  <Form.Group controlId="v">
  <div className="row">

    <div className="col-md-4">
<Form.Label>Select Starting Bus Stop </Form.Label>
     <Form.Control as="select" name="startingStop" value={state.startingStop} custom onChange={handleInput} >
          <option>Select</option>
          {stopsList}
        </Form.Control>

    <Form.Label>Schedule</Form.Label>
    <br></br>
    <Button size="sm" onClick={e => addSchedule(e)}>Add</Button>
    <br></br>
 <Form.Label>Route Type</Form.Label>
 <Form.Control size="sm "as="select" name="routeType" value={state.routeType} custom onChange={handleInput} >
          <option>Select</option>
          <option>REGULAR</option>
          <option>EXPRESS</option>
          <option>NONSTOP</option>
        </Form.Control>
    </div>
<div className="col-md-4">
<Form.Label>Select Ending Bus Stop </Form.Label>
     <Form.Control as="select" name="endingStop" value={state.endingStop} custom onChange={handleInput} >
          <option>Select</option>
          {stopsList}
        </Form.Control>
    <Form.Label>In Between Stops </Form.Label>
    <br></br>
    <Button size="sm" onClick={e => addIntermediary(e)}>Add</Button>
    <br></br>

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
    </Form.Group>
        <Button size="sm" onClick={e => handleSubmit(e)}>Create Route</Button>
  </form> 
   </>
  );
};

