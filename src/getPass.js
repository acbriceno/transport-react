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

function GetPassPage(props) {
console.log(props.location.getPassRoute)
  if(props.location.getPassRoute === undefined){
    
   props.history.push("/") 

  }
  return (
   <>
    <Jumbotron>
      <h2 className="text-center">Transport Management Administrative Panel</h2>
        <div>
          </div>
    </Jumbotron>
<div>
   </div>
    </>
  );
}

export default GetPassPage;

