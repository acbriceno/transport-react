import React from 'react'
import auth from './auth'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
export const NavBar = props => {
  return (
    <>
    <Row>
     <Col></Col>
    <Col xs={6}></Col>
  <p> Welcome {auth.getName()}</p>
    <Col>
    <Button size="sm"
        onClick={() => {
          auth.removeAuth(() => {
            props.history.push("/");
          });
        }}
        > Logout </Button>
    </Col>
    </Row>
  </>
  )
}
