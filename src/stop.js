import React, {useRef, useState} from "react";
import auth from "./auth";
import roleManager from './RoleManager'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import {gql, useQuery} from '@apollo/client'

const stops = gql`
{
  stops{
    status
		code
    ... on StopsResponse{
      stops{
        name
        lon
      }
    }
  }
}
`

export const StopsPage = props => {

  const {loading, error, data} = useQuery(stops)

 
  if(loading){return (<p> Loading... </p>)}
  if(error) { return ( <p> error.. </p>)}


 const stopsList = data.stops.stops.map((stop) =>
  <ListGroup.Item key={stop.id}> 

  <div className="row">
    <div className="col-sm-6">
      <p>{stop.name}</p>
    </div>
    <div className="col-sm-6" >
        <button  className="btn btn-success btn-sm btn-space">Edit</button>
        <button  className="btn btn-danger btn-sm">Delete</button>
    </div>
  </div>
  </ListGroup.Item>
 )

 

  
  return (
    <>
      <ListGroup>{stopsList}</ListGroup>
    </>
  );
};

