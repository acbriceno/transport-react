import React from 'react'
import {useQuery, gql } from '@apollo/client'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import {Accordion, Tab, Row, Col, Nav} from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import auth from './auth'
import {CreateStopPage} from './createStop'
import {StopsPage} from './stop'
import {CreateOperatorPage} from './createOperator'
import {NavBar} from './navbar.js'
function Admin(props) {

  return (
   <>
    <Jumbotron className="noP secondaryGradient">
 <NavBar {...props}/>
      <h2 className="text-center white-text">Transport Management Administrative Panel</h2>
    <br></br>
    <br></br>
        <div>
          </div>
    </Jumbotron>
<div className="row">
    <div className="col-md-12 someP">
 


 <Tab.Container id="left-tabs-example " defaultActiveKey="head">
  <Row>
    <Col sm={3} className="">
      <Nav variant="pills" className="flex-column">
        <Nav.Item>
          <Nav.Link className=" " eventKey="head">Dashboard</Nav.Link>
        </Nav.Item>

        <Nav.Item className="white-text">
          <Nav.Link eventKey="stopManagement" >Stop Management</Nav.Link>
        </Nav.Item>
   <Nav.Item>
          <Nav.Link eventKey="operatorManagement">Operator Management</Nav.Link>
        </Nav.Item>
          <Nav.Item>
          <Nav.Link eventKey="tracking">Real Time Tracking</Nav.Link>
        </Nav.Item>


    </Nav>
    </Col>
    <Col sm={9}>
      <Tab.Content className="">
        <Tab.Pane eventKey="stopManagement">

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


  </Accordion>
    </Tab.Pane>
        <Tab.Pane eventKey="operatorManagement">
    <Accordion >
   <Card>
    <Accordion.Toggle as={Card.Header} eventKey="2">
      Create Operator
    </Accordion.Toggle>
    <Accordion.Collapse eventKey="2">
      <Card.Body> <CreateOperatorPage {...props} /> </Card.Body>
    </Accordion.Collapse>
  </Card>

  </Accordion>
        </Tab.Pane>
<Tab.Pane eventKey="head">
    <img className="responsive" class="img-responsive"src="./operatorDashboard.png" width="100%"/>
        </Tab.Pane>
      </Tab.Content>
    </Col>
  </Row>
</Tab.Container>

    </div>

</div>
    </>
  );
}

export default Admin;

