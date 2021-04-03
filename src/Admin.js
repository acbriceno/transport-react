import React from 'react'
import {useQuery, gql } from '@apollo/client'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import auth from './auth'
import {CreateStopPage} from './createStop'
import {StopsPage} from './stop'
import {CreateOperatorPage} from './createOperator'

function Admin(props) {

  return (
   <>
    <Jumbotron className="primaryBG">
      <h2 className="text-center white-text">Transport Management Administrative Panel</h2>
        <div>
          </div>
    </Jumbotron>
<div className="row">
    <div className="col-md-1"></div>
    <div className="col-md-10">
    <Accordion >
  <Card>
    <Accordion.Toggle as={Card.Header} eventKey="0">
      Create Stop
    </Accordion.Toggle>
    <Accordion.Collapse eventKey="0">
     <Card.Body> <CreateStopPage {...props} /> </Card.Body>
    </Accordion.Collapse>
  </Card>
  <Card>
    <Accordion.Toggle as={Card.Header} eventKey="1">
      Stops
    </Accordion.Toggle>
    <Accordion.Collapse eventKey="1">
      <Card.Body> <StopsPage{...props} />  </Card.Body>

    </Accordion.Collapse>
  </Card>
  <Card>
    <Accordion.Toggle as={Card.Header} eventKey="2">
      Create Operator
    </Accordion.Toggle>
    <Accordion.Collapse eventKey="2">
      <Card.Body> <CreateOperatorPage {...props} /> </Card.Body>
    </Accordion.Collapse>
  </Card>

  </Accordion>
    </div>
  <div className="col-md-1"></div>

</div>
    </>
  );
}

export default Admin;

