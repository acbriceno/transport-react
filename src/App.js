import React from 'react'
import {useQuery, gql } from '@apollo/client'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import auth from './auth'
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

function App(props) {

  const {loading, error, data} = useQuery(stops)

  if(loading) return <p> Loading ... </p>
  if(error) return <p> error... wrong</p>
  console.log(loading)
  console.log(data)

  return (
   <>
    <Container>
    <Jumbotron>
      <h2>Stops {data.stops.status.toString()}</h2>
        <div>
      <button
        onClick={() => {
          auth.removeAuth(() => {
            props.history.push("/");
          });
        }}
      >
        Logout
      </button>
    </div>
    </Jumbotron>
    </Container>
    </>
  );
}

export default App;

