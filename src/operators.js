import React, {useRef, useState} from "react";
import auth from "./auth";
import roleManager from './RoleManager'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import {gql, useQuery} from '@apollo/client'

const operators = gql`

{

  operators


}



`

