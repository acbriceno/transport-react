import React from 'react'
import {useQuery, gql } from '@apollo/client'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import {Tab, Row, Col, Nav} from 'react-bootstrap'
import auth from './auth'
import {CreateRoutePage} from './createRoute'
import {NavBar} from './navbar.js'
function Operator(props) {

  return (
   <>
    <Jumbotron className=" noP jumbotron-fluid primaryGradient">
    <NavBar {...props}/>
      <h2 className="text-center white-text">Transport Management Operator Panel</h2>
      
    <br></br>
    <br></br>
    <div>
          </div>
    </Jumbotron>

 <Tab.Container id="left-tabs-example " defaultActiveKey="head">
  <Row>
    <Col sm={3} className="someP">
      <Nav variant="pills" className="flex-column">
        <Nav.Item>
          <Nav.Link className=" " eventKey="head">Dashboard</Nav.Link>
        </Nav.Item>

        <Nav.Item className="white-text">
          <Nav.Link eventKey="first" >Create Route</Nav.Link>
        </Nav.Item>
   <Nav.Item>
          <Nav.Link eventKey="routeManagement">Route Management</Nav.Link>
        </Nav.Item>
          <Nav.Item>
          <Nav.Link eventKey="tracking">Real Time Tracking</Nav.Link>
        </Nav.Item>
   <Nav.Item>
          <Nav.Link eventKey="sales">Sale Management</Nav.Link>
        </Nav.Item>
     
         <Nav.Item>
          <Nav.Link eventKey="employeeManagement">Employee Management</Nav.Link>
        </Nav.Item>
 
         <Nav.Item>
          <Nav.Link eventKey="accountManagement">Account Management</Nav.Link>
        </Nav.Item>

    </Nav>
    </Col>
    <Col sm={9}>
      <Tab.Content className="topP">
        <Tab.Pane eventKey="first">
   <Accordion >
   <Card>
    <Accordion.Toggle as={Card.Header} eventKey="2">
      Create Operator
    </Accordion.Toggle>
    <Accordion.Collapse eventKey="2">
      <Card.Body> <CreateRoutePage {...props} /> </Card.Body>
    </Accordion.Collapse>
  </Card>

  </Accordion>

    </Tab.Pane>
        <Tab.Pane eventKey="second">
    <p>asd</p>
        </Tab.Pane>
<Tab.Pane eventKey="head">
    <img className="responsive" class="img-responsive"src="./operatorDashboard.png" width="100%"/>
        </Tab.Pane>
      </Tab.Content>
    </Col>
  </Row>
</Tab.Container>
<div className="row center-block">
 <div className="col-md-1"></div>
   
<div className="col-md-10">


   </div>
</div>
    <div className="center-block">
      
    </div>
    </>
  );
}

export default Operator;

