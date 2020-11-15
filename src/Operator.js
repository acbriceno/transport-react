import React from 'react'
import {useQuery, gql } from '@apollo/client'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import auth from './auth'
import {CreateRoutePage} from './createRoute'
function Operator(props) {

  return (
   <>
    <Jumbotron>
      <h2 className="text-center">Transport Management Operator Panel</h2>
        <div>
          </div>
    </Jumbotron>


<div className="center-block">
<Accordion >
  <Card>
    <Accordion.Toggle as={Card.Header} eventKey="0">
      Create Route
    </Accordion.Toggle>
    <Accordion.Collapse eventKey="0">
     <Card.Body> <CreateRoutePage {...props} /> </Card.Body>
    </Accordion.Collapse>
  </Card>
</Accordion>
   </div>

    <div className="center-block">
      
    </div>
    </>
  );
}

export default Operator;

