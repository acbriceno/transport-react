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
function Operator(props) {

  return (
   <>
    <Jumbotron className="jumbotron-fluid primaryBG">
      <h2 className="text-center white-text">Transport Management Operator Panel</h2>
        <div>
          </div>
    </Jumbotron>

 <Tab.Container id="left-tabs-example P" defaultActiveKey="">
  <Row>
    <Col sm={3} className="someP">
      <Nav variant="pills" className="flex-column">
        <Nav.Item>
          <Nav.Link eventKey="head">Apps</Nav.Link>
        </Nav.Item>

        <Nav.Item className="">
          <Nav.Link eventKey="first" aria-disabled="true">Create Route</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="second">Tab 2</Nav.Link>
        </Nav.Item>
      </Nav>
    </Col>
    <Col sm={9}>
      <Tab.Content className="someP">
        <Tab.Pane eventKey="first">
    <CreateRoutePage {...props} /> 
    </Tab.Pane>
        <Tab.Pane eventKey="second">
    <p>asd</p>
        </Tab.Pane>
<Tab.Pane eventKey="head" disabled="true">
    <p>asd</p>
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

