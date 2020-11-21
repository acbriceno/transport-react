import React from 'react'
import {useQuery, gql, useMutation } from '@apollo/client'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import auth from './auth'
import {CreateStopPage} from './createStop'
import {StopsPage} from './stop'
import {CreateOperatorPage} from './createOperator'


const  createPassM = gql `
    mutation createPass($pass: PassInput!){
      createPass(pass:$pass){
        status
        code
        ... on PassResponse{
          pass {
            id
            mediaPath
            value
            purchaseDate
            redeemed
            routeType
            route{
              startStopId
              endStopId
              distance
            }
          }
        }
      }
    }
  `

function GetPassPage(props) {
console.log(props.location.getPassRoute)
  if(props.location.getPassRoute === undefined){
    
   props.history.push("/") 

  }

  const [createPass, { loading, error, data }] = useMutation(createPassM, {
    onCompleted: (data) =>{
      if(data !== undefined ){
       console.log(data)
      if(data.createPass === null){
      }else{
        props.history.push("/passes") 
      }

  }

    },
    onError: (error) => console.error("Error", error)
  })

  if(loading){return (<p> Loading... </p>)}

  const handleCreatePass = e => {
    e.preventDefault()
    createPass({variables: {pass:{
      value: 5,
      route:{
        startStopId: props.location.getPassRoute.route.route.startStopId,
        endStopId: props.location.getPassRoute.route.route.endStopId
      },
      routeType: props.location.getPassRoute.route.routeType

    }}})
  }

  const handleCancelPass = e =>{
    e.preventDefault()
    props.history.push("/")
  }


  return (
   <>
    <Jumbotron>
      <h2 className="text-center">Get Pass</h2>
<Table striped bordered hover className="table-sm">
      <thead>
        <tr>
          <th>{props.location.getPassRoute.startStopName}</th>

          <th>To</th>
          <th>{props.location.getPassRoute.endStopName}</th>
          <th>{props.location.getPassRoute.route.routeType}</th>
          <th>$5</th>
        </tr>
      </thead>
    <tbody>
    <tr>
    <td colspan="4" className="text-center"> 
      <Button size="sm" className="btn-space" onClick={handleCancelPass}> Cancel </Button>

      <Button size="sm" onClick={handleCreatePass}>Confirm</Button>
    </td>
    </tr>

    </tbody>
    </Table>
          
    </Jumbotron>
    </>
  );
}

export default GetPassPage;

