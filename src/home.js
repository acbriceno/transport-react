import React, {useState, useEffect} from 'react'
import {useQuery, gql } from '@apollo/client'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import auth from './auth'


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


const routes = gql`
{
  activeOperatorRoutes{
    status
    code
    ... on OperatorRoutesResponse {
      operatorRoutes {
        id
        route{
          startStopId
          endStopId
        }
        schedule{
          day
          departureTime
          arrivalTime
        }
        routeType
        operatorId
        intermediaries{
          stopId
          time
        }
      }
    }
  }
}
`

const dayNames = [
  "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY","THURSDAY", "FRIDAY",
  "SATURDAY"
]

const initialState = {
  search: "",
  historyRoutes: [],
  days: [
    false, false, false, false, false, false, false  
  ],
  stops: [],
  routes: [],
  displayRoutes: []
}

const resetState = {
  search: "",
  historyRoutes: [],
  days: [],
  stops: [],
  routes: [],
  displayRoutes: []
}
const todayDate = new Date()
const accessRole = "COMMUTER"
function HomePage(props) {
  const {loading:stopsLoading, error:stopsError, data:stopsData} = useQuery(stops)
  const {loading:routesLoading, error:routesError, data:routesData} = useQuery(routes)
  const [state, setState] = useState(initialState)
  useEffect(() => {
    setState(state => {
      if(!routesLoading && !stopsLoading){
      let todaysDate = new Date()
      let days = state.days
      days[todaysDate.getDay()] = true
      let displayRoutes = []
      let historyRoutes = []
      for(const route of routesData.activeOperatorRoutes.operatorRoutes){
        for(const schedule of route.schedule){
          if(schedule.day === dayNames[todaysDate.getDay()]){
              let tempRoute = {
                id: route.id,
                route: route.route,
                operatorId: route.operatorId,
                routeType: route.routeType,
                intermediaries: route.intermediaries,
                schedule: schedule
            }
            displayRoutes = displayRoutes.concat(tempRoute)
            
          }

                let tempHRoute = {
                id: route.id,
                route: route.route,
                operatorId: route.operatorId,
                routeType: route.routeType,
                intermediaries: route.intermediaries,
                schedule: schedule
                 }
            historyRoutes = historyRoutes.concat(tempHRoute)

        
        }
      }
        
      return {
        ...state,
        historyRoutes: historyRoutes,
        displayRoutes: displayRoutes,
        days: days,
        routes: routesData.activeOperatorRoutes.operatorRoutes,
        stops: stopsData.stops.stops
      }
      }
      return{
        ...state
      }
    })
  },[routesData])
  if(stopsLoading){return (<p> Loading... </p>)}
  if(stopsError) { return ( <p> error.. </p>)}
  if(routesLoading){return (<p> Loading... </p>)}
  if(routesError) { return ( <p> error.. </p>)}

   
console.log(stopsLoading)
console.log(stopsError)
console.log(stopsData)
console.log(routesData)
console.log(state)
  
 const stopsList = stopsData.stops.stops.map((stop) =>
<React.Fragment key={stop.id}>
  <option key={stop.id}>{stop.name}</option>
</React.Fragment>
 )
 const getStopName = (id)=>{
    for(const stop of state.stops){
      if(id === stop.id){
        return stop.name
      }
      
    }
      console.log("no match")
      return id
  }


  const getIntermediariesDisplay = (displayRouteId) =>{
    let intermediaries = state.displayRoutes[displayRouteId].intermediaries
    
   return intermediaries.map((intermediary, idx) => 
  <React.Fragment key="intermediary.id">
    <tr className="table-primary">
      <td>In Between Stop</td> 
     <td colspan="2" className="text-center">{getStopName(intermediary.stopId)}</td> 
     <td>{intermediary.time}</td>
    </tr>
   </React.Fragment>
)

  }

 const displayRoutesList = state.displayRoutes.map((route, idx) => 
  <React.Fragment key="route.id">
    <tr>
     <td>{route.schedule.departureTime}</td> 
     <td>{getStopName(route.route.startStopId)}</td>
      <td>{getStopName(route.route.endStopId)}</td>
      <td>{route.schedule.arrivalTime}</td>
    </tr>
    {getIntermediariesDisplay(idx)} 
    
   </React.Fragment>
)

  const onKeyDown = e =>{
    if (e.keyCode === 8) {
     console.log('delete');

      setState(state =>{
        let displayRoutes = state.historyRoutes

        return {
          ...state,
          search: e.value,
          displayRoutes: displayRoutes
        }
      }, () => {
        const search = state.search
        searchChangeState(search)
      })

    }
  }
  const handleSearchInput = e => {
    e.preventDefault()
    console.log(e.target) 
    
    if(e.keyCode !== 8){
    searchChangeState(e.target.value)
    }
  }

  const searchChangeState = input => {

    setState(state => {
      let displayRoutes = []
      let searchFilter = input.toUpperCase().trim()
      console.log("search filter")
      console.log(searchFilter)
      for(const route of state.displayRoutes){
        if( (getStopName(route.route.startStopId).toUpperCase().indexOf(searchFilter) >-1) || (getStopName(route.route.endStopId).toUpperCase().indexOf(searchFilter) >-1) || (getStopName(route.route.startStopId).replace(/\s+/g, '').toUpperCase().indexOf(searchFilter) >-1) ||  (getStopName(route.route.endStopId).replace(/\s+/g, '').toUpperCase().indexOf(searchFilter) >-1)    ){
              console.log("match first search")
              let tempRoute = {
              id: route.id,
              route: route.route,
              operatorId: route.operatorId,
              routeType: route.routeType,
              intermediaries: route.intermediaries,
              schedule: route.schedule
            }
            displayRoutes = displayRoutes.concat(tempRoute)
            console.log(displayRoutes)
      
        }else{
          console.log("failed 1st search")
            for(const intermediary of route.intermediaries){
              if((getStopName(intermediary.stopId).toUpperCase().indexOf(searchFilter) >-1 ) 
                  || (getStopName(intermediary.stopId).toUpperCase().replace(/\s+/g, '').indexOf(searchFilter) >-1 )
              ){
               let tempRoute = {
                id: route.id,
                route: route.route,
                operatorId: route.operatorId,
                routeType: route.routeType,
                intermediaries: route.intermediaries,
                schedule: route.schedule
              }
              displayRoutes = displayRoutes.concat(tempRoute)

            }
          }
        }
      }
    
      return {
        ...state,
        displayRoutes: displayRoutes
      }

    })
  }
 
  const handleCheckInput = e => {
    console.log(e.target)
    setState(state =>{
      let days = state.days
      days[parseInt(e.target.dataset.id)] = !days[e.target.dataset.id]
      let dayName = dayNames[e.target.dataset.id]
      let displayRoutes = state.displayRoutes

      if(days[e.target.dataset.id]){

        let routes = state.routes
        console.log("ready to make things happen")
        console.log(days[e.target.dataset.id])
        console.log("make")
        for(const route of routes){
        for(const schedule of route.schedule){
          if(schedule.day === dayName){
            console.log("day matched")
            let tempRoute = {
              id: route.id,
              route: route.route,
              operatorId: route.operatorId,
              routeType: route.routeType,
              intermediaries: route.intermediaries,
              schedule: route.schedule
            }
            displayRoutes = displayRoutes.concat(tempRoute)
              
          }
        }
      }

      }else{
        displayRoutes = []
        for(const route of state.displayRoutes){
            if(route.schedule.day !== dayName){
              displayRoutes = displayRoutes.concat(route)

            }
        }
      }

     console.log("displayroutes") 
      console.log(displayRoutes) 
      return{
        ...state,
        days:days,
        displayRoutes: displayRoutes
      }

    })
  }

  const getChecked = (dayId) => {
    let dayNumber = todayDate.getDay()
    if(dayNumber === (dayId)){
      return "checked"
    }
  }




  const daysList = dayNames.map((day, idx) => 

    <React.Fragment key={idx}>
     <Form.Check inline label={day} type="checkbox" data-id={idx} checked={state.days[idx]} onChange={handleCheckInput}/> 
    </React.Fragment>
  )
 
  

  return (
    <>


    <Jumbotron className="body-bg">
    <div className="row"> 
    <div className="col-md-2"> </div>
    <Form>
    
      <div className="col-md-12">
   <div className="row">
    <InputGroup >
    <FormControl
      placeholder="Search..."
      aria-label="search input"
      aria-describedby="basic-addon2"
      onChange={handleSearchInput}
      onKeyDown={onKeyDown}
    />
    <InputGroup.Append>
      <Button variant="outline-secondary">Search</Button>
    </InputGroup.Append>
  </InputGroup>
    </div>
      <br></br>
        {daysList}
    <br></br>
      </div>

 
    </Form>
    </div>
    
    <Table striped bordered hover className="table-sm">
      <thead>
        <tr>
          <th>Departure Time</th>
          <th>Departure Stop</th>
          <th>Arrival Stop</th>
          <th>Arrival Time</th> 
        </tr>
      </thead>
      <tbody>
        {displayRoutesList} 
      </tbody>
    </Table>
    </Jumbotron>
      <Jumbotron className="body-bg">
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <form>
          <Form.Group>
        <div className="row text-center">
          <div className="col-md-4">
            <Form.Label>Select Starting Bus Stop </Form.Label>
            <Form.Control size="sm" as="select" name="startingStop"  >
              <option>Select...</option>
              {stopsList}
            </Form.Control> 
          </div>
          <div className="col-md-4 "> 
          <Form.Label >Select Arrival Bus Stop </Form.Label>
            <Form.Control size="sm" as="select" name="endingStop"  >
              <option>Select...</option>
              {stopsList}
          </Form.Control> 
          </div>
          <div className="col-md-4"> 
          <Form.Label>Select Pass Type </Form.Label>
            <Form.Control size="sm" as="select" name="routeType"  >
              <option>Select...</option>
              <option>EXPRESS</option>
              <option>REGULAR</option>
              <option>NONSTOP</option>
            </Form.Control> 
          </div>
        </div>
    <div className="row">
      
      <div className="col-md-5"></div>
    <div classname="col-md-4"> 
      <br></br>    
      <Button>Buy Pass</Button>
    </div>
      <div className="col-md-2"></div>
    </div>
    </Form.Group>
          </form>
        </div>
        <div className="col-md-2"> </div>
      </div>
      </Jumbotron>   
    </>
  );



}

export default HomePage;

