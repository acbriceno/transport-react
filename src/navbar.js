import React from 'react'
import auth from './auth'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
export const NavBar = props => {
 

  const redirectLogin = e => {
     props.history.push("/login");

  }

 const redirectRegister = e => {
     props.history.push("/register");

  }
 const redirectHome = e => {
     props.history.push("/");

  }


  const redirectPasses = e => {
     props.history.push("/passes");

  }


  const displayHeader = ()=>{

    if(auth.getRole() !== null ){
    
      if(auth.getRole() === "COMMUTER"){
      return (
        <>
        <p>Welcome {auth.getName()}</p>
    <Col>
   <Button size="sm" className="btn-space btn-info"
        onClick={redirectHome}
        >Home</Button>
 <Button size="sm" className="btn-space btn-info"
        onClick={redirectPasses}
        >Passes</Button>

    <Button size="sm"
        onClick={() => {
          auth.removeAuth(() => {
            props.history.push("/");
          });
        }}
        > Logout </Button>
      </Col>
        </>
      )

      }

      return (
        <>
        <p>Welcome {auth.getName()}</p>
    <Col>
   <Button size="sm" className="btn-space btn-info"
        onClick={redirectHome}
        >Home</Button>
    <Button size="sm"
        onClick={() => {
          auth.removeAuth(() => {
            props.history.push("/");
          });
        }}
        > Logout </Button>
      </Col>
        </>
      )



    }else{
    return (
    <Col>
     <Button size="sm" className="btn-space btn-info"
        onClick={redirectHome}
        >Home</Button>
      <Button size="sm" className="btn-space"
        onClick={redirectLogin}
        >Login</Button>
        <Button size="sm" className="btn-success"
        onClick={redirectRegister}
        >Register</Button>

    </Col>
    )
    }
  }

  return (
    <>
    <Row className="header-bg">
     <Col></Col>
    <Col xs={6}></Col>
    {displayHeader()}
    </Row>
  </>
  )
}
