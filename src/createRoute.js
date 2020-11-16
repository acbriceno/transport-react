import React, {useRef, useState} from "react";
import auth from "./auth";
import roleManager from './RoleManager'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Toast from 'react-bootstrap/Toast'
import {gql,useQuery, useMutation} from '@apollo/client'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
const  createOperatorRouteM = gql `
    mutation createOperatorRoute($operatorRoute: OperatorRouteInput!){
      createOperatorRoute(operatorRoute: $operatorRoute){
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
   routeType: '',
   scheduleList: [],
   intermediaryList: []
 }

const resetState = {
  startingStop: '',
  endingStop: '',
  routeType: '',
  scheduleList: [],
  intermediaryList: []
}
let scheduleCounter = 0
const intermediaryListState = []

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
        console.log(createOperatorRouteData)
        if(createOperatorRouteData.createOperatorRoute === null){
        }else{
          if(!createOperatorRouteData.createOperatorRoute.status){
            return (<p> Operator Route no created </p>)
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
    let operatorRoute = {
          route:{
            startStopId: state.startingStop,
            endStopId: state.endingStop
          },
          routeType: state.routeType,
          schedule: state.scheduleList,
          intermediaries: state.intermediaryList
        }
    console.log(operatorRoute)

    createOperatorRoute({
      variables: {
        operatorRoute:{
          route:{
            startStopId: state.startingStop,
            endStopId: state.endingStop
          },
          routeType: state.routeType,
          schedule: state.scheduleList,
          intermediaries: state.intermediaryList
        }
      }
    })
   //createOperatorRoute({ variables: {user:{email: state.email, password: state.password, firstName: state.firstName, lastName: state.lastName, role:{role: state.role} }, operator:{name: state.operatorName, licenseNo: state.operatorLicenseNo}} });
    
    
  }

  const handleSubmit = e => {
    e.preventDefault()
    console.log(state)
    for(let key in state){
      if(state[key] === '' || state[key].length === 0){
        setErrors(`You must provide the input ${key}`)
        console.log(errors)
        return
      }
    
    }

    setErrors('')

    handleCreateRoute()
  }

  const handleInput = e => {
    const inputName = e.currentTarget.name
    const value = e.currentTarget.value
   console.log(e.target.value) 
    if(["day", "departureTime", "arrivalTime"].includes(e.target.dataset.classname)){
      let scheduleList = state.scheduleList
      scheduleList[e.target.dataset.id][e.target.dataset.classname] = e.target.value
      setState(state => {

          return {
          ...state,
          scheduleList: scheduleList
        }
      })

    }else if(["time", "stopId"].includes(e.target.dataset.classname)){
       let intermediaryList = state.intermediaryList
      intermediaryList[e.target.dataset.id][e.target.dataset.classname] = e.target.value
      setState(state => {

          return {
          ...state,
          intermediaryList: intermediaryList
        }
      })

    }
    else {

    setState(prev => ({...prev, [inputName]: value}))
    }

  }
  console.log(state)
 
  const stopsList = stopsData.stops.stops.map((stop) =>
  <option key={stop.id} value={stop.id}>{stop.name}</option>  
 )




  const addSchedule = e => {
 e.preventDefault()
     // scheduleCounter++
      //let key = "tx".concat(scheduleCounter)
      setState(state => {
        const scheduleList = state.scheduleList.concat({
       //   key: key,
          day: "",
          departureTime: "",
          arrivalTime: ""
        })
        return {
          ...state,
          scheduleList: scheduleList
        }
      })
  }
  const addIntermediary = e => {
      e.preventDefault()
      //let key = "tx".concat(scheduleCounter)
      setState(state => {
        const intermediaryList = state.intermediaryList.concat({
       //   key: key,
          stopId: "",
          time: ""
        })
        return {
          ...state,
          intermediaryList: intermediaryList
        }
      })

  }
  const time = "time"
  const stopId = "stopId"
  const intermediaryList = state.intermediaryList.map((value, idx) =>

    
    < React.Fragment key={idx}>
    <ListGroup.Item>
    <div className="row">
      <div className="col-md-6">
      <Form.Label>Select Bus Stop </Form.Label>
     <Form.Control as="select" name={stopId.concat(idx)} data-id={idx} id={stopId.concat(idx)} value={state.intermediaryList[idx].stopId} data-classname={stopId} custom onChange={handleInput} >
          <option>Select</option>
          {stopsList}
        </Form.Control>

      </div>
   <div className="col-md-6">
 <Form.Label>Arrival Time </Form.Label>

     <Form.Control size="sm"  type="time" name={time.concat(idx)} data-id={idx} id={time.concat(idx)} value={state.intermediaryList[idx].time}  data-classname={time}  onChange={handleInput}/>

      </div>
     </div>
    </ListGroup.Item>
     </React.Fragment>
    
 )


const day = "day"
const departureTime = "departureTime"
const arrivalTime = "arrivalTime"
  const scheduleList = state.scheduleList.map((value, idx) =>

    
    < React.Fragment key={idx}>
    <ListGroup.Item>
    <div className="row">
      <div className="col-md-4">
 <Form.Label>Select Day </Form.Label>
     <Form.Control as="select" name={day.concat(idx)} data-id={idx} id={day.concat(idx)} value={state.scheduleList[idx].day}  data-classname="day" custom onChange={handleInput}>
      <option>Select</option>
      <option>MONDAY</option>
      <option>TUESDAY</option>
      <option>WEDNESDAY</option>
      <option>THURSDAY</option>
      <option>FRIDAY</option>
      <option>SATURDAY</option>
      <option>SUNDAY</option>
      </Form.Control>

      </div>
   <div className="col-md-4">
 <Form.Label>Departure Time </Form.Label>

     <Form.Control size="sm"  type="time"  name={departureTime.concat(idx)} data-id={idx} id={departureTime.concat(idx)} value={state.scheduleList[idx].departureTime}  data-classname={departureTime}  onChange={handleInput}/>

      </div>
 <div className="col-md-4">
<Form.Label>Arrival Time </Form.Label>

     <Form.Control size="sm" type="time" name={arrivalTime.concat(idx)} data-id={idx} id={arrivalTime.concat(idx)} value={state.scheduleList[idx].arrivalTime}  data-classname={arrivalTime} onChange={handleInput} />

      </div>

    </div>
    </ListGroup.Item>
     </React.Fragment>
    
 )
  
  return (
    <>
 { errors && ( <p>{errors}</p>)
    }
<form>
  <Form.Group controlId="v">
  <div className="row">

    <div className="col-md-6">
<Form.Label>Select Starting Bus Stop </Form.Label>
     <Form.Control as="select" name="startingStop" value={state.startingStop} custom onChange={handleInput} >
          <option>Select</option>
          {stopsList}
        </Form.Control>

    <Form.Label>Schedule</Form.Label>
    <br></br>
    <Button size="sm" onClick={e => addSchedule(e)}>Add</Button>
    <br></br>
    <ListGroup>
    {scheduleList}
    </ListGroup>
    <br></br>
 <Form.Label>Route Type</Form.Label>
 <Form.Control size="sm "as="select" name="routeType" value={state.routeType} custom onChange={handleInput} >
          <option>Select</option>
          <option>REGULAR</option>
          <option>EXPRESS</option>
          <option>NONSTOP</option>
        </Form.Control>
    </div>
<div className="col-md-5">
<Form.Label>Select Ending Bus Stop </Form.Label>
     <Form.Control as="select" name="endingStop" value={state.endingStop} custom onChange={handleInput} >
          <option>Select</option>
          {stopsList}
        </Form.Control>
    <Form.Label>In Between Stops </Form.Label>
    <br></br>
    <Button size="sm" onClick={e => addIntermediary(e)}>Add</Button>
    <br></br>
    <ListGroup>
    {intermediaryList}
    </ListGroup>
    <br></br>
    </div>
 
  </div>
    </Form.Group>
        <Button size="sm" onClick={e => handleSubmit(e)}>Create Route</Button>
  </form> 
   </>
  );
};

