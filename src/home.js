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
  displayRoutes: [],
  searchFilter: false,
  dayFilter: false
}

const resetState = {
  search: "",
  historyRoutes: [],
  days: [],
  stops: [],
  routes: [],
  displayRoutes: [],
  searchFilter: false,
  dayFilter: false
}
const displayCheck = false
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


const searchChangeState = (input, control) => {

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
        search: input,
        displayRoutes: displayRoutes,
        searchFilter: control ? !state.searchFilter : state.searchFilter
      }

    })
  }


const onKeyDown = e =>{
    if (e.keyCode === 8) {
     console.log('delete');

      setState(state =>{
        let displayRoutes = state.historyRoutes

        return {
          ...state,
          search: e.value,
          dayFilter: !state.dayFilter,
          displayRoutes: displayRoutes
        }
      })

    }
  }

const dayFilterChangeState = (dayState, control) =>{
      let dayNamesTrue = [] 
      if(dayState.includes(true)){


        setState(state => {
         var daysTrue = dayState.reduce((daysTrue, day, id) => {
            if(day){
              daysTrue = daysTrue.concat(dayNames[id])
            }
           return daysTrue
          }, [])

          console.log(daysTrue)
          let displayRoutes = []
          for(const route of state.historyRoutes){
            if(daysTrue.includes(route.schedule.day)){
              displayRoutes = displayRoutes.concat(route)
            }
          }
        
          return {
            ...state,
            displayRoutes: displayRoutes,
            days: dayState,
            searchFilter: control ? !state.searchFilter : state.searchFilter
          }

        })

      }else{
          setState(state =>{
            console.log(state.days)
        return {
          ...state,
          searchFilter: control ? !state.searchFilter : state.searchFilter,
          displayRoutes: state.historyRoutes
        }
      })
      }
    console.log("testing day Filter")

  }


useEffect(() => {
  
console.log("updating use effec display routes");
  const search = state.search
  console.log("to apply search filter")
  searchChangeState(search, false)

}, [state.searchFilter]);



useEffect(() => {
  
console.log("updating use effec display routes");
  const days = state.days
  console.log("to apply day filter")
  dayFilterChangeState(days, false)

}, [state.dayFilter]);

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
  <React.Fragment key="idx">
    <tr className="table-primary">
      <td>In Between Stop</td> 
     <td colspan="2" className="text-center">{getStopName(intermediary.stopId)}</td> 
     <td>{intermediary.time}</td>
    </tr>
   </React.Fragment>
)

  }
const handleGetPass = e => {
  e.preventDefault()
  if(auth.getRole() !== null){
    if(auth.getRole() === "COMMUTER"){
      console.log("match commuter")
      props.history.push({
        pathname: "/getpass", 
        getPassRoute: {route: state.displayRoutes[e.target.dataset.id], startStopName: getStopName(state.displayRoutes[e.target.dataset.id].route.startStopId), endStopName: getStopName(state.displayRoutes[e.target.dataset.id].route.endStopId)}
      })
    }
  }else{
    props.history.push({
    pathname: "/login",
    getPassRoute: {route: state.displayRoutes[e.target.dataset.id], startStopName: getStopName(state.displayRoutes[e.target.dataset.id].route.startStopId), endStopName: getStopName(state.displayRoutes[e.target.dataset.id].route.endStopId)}

  }
  )

  }
 }
 const displayRoutesList = state.displayRoutes.map((route, idx) => 
  <React.Fragment key="route.id">
    <tr>
      <td>{route.schedule.day}</td>
     <td>{route.schedule.departureTime}</td> 
     <td>{getStopName(route.route.startStopId)}</td>
      <td>{getStopName(route.route.endStopId)}</td>
      <td>{route.schedule.arrivalTime}</td>
      <td className="text-center"><Button size="sm" className="btn-success" onClick={handleGetPass} data-id={idx}>GetPass</Button> </td>
    </tr>
   <tr></tr>
    {getIntermediariesDisplay(idx)} 
    
   </React.Fragment>
)

    const handleSearchInput = e => {
    e.preventDefault()
    console.log(e.target) 
    
    if(e.keyCode !== 8){
    searchChangeState(e.target.value)
    }
  }

  

  
  const handleDayCheckInput = e => {
      let days = state.days
      days[parseInt(e.target.dataset.id)] = !days[e.target.dataset.id]
      dayFilterChangeState(days ,true)
  }

 
  const handleCheckInput = e => {
    console.log(e.target)
    setState(state =>{
      let counter = 0
      let days = state.days
      days[parseInt(e.target.dataset.id)] = !days[e.target.dataset.id]
      for(const day of days){
        if(!day){counter++}
      }
      console.log(counter)
      if(counter === 7){
          return {
            ...state,
            displayRoutes: state.historyRoutes
          }
      }
      let dayName = dayNames[e.target.dataset.id]
      
      let displayRoutes = []
      if(days[e.target.dataset.id]){
         for(const route of state.displayRoutes){
        if(route.schedule.day === dayName){
            displayRoutes = displayRoutes.concat(route)
        }
      }

      }else{

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
     <Form.Check inline label={day} type="checkbox" data-id={idx} checked={state.days[idx]} onChange={handleDayCheckInput}/> 
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
      value={state.search}
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
          <th>Day </th>
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

