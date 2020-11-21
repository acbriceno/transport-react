import {useQuery, gql} from '@apollo/client'
import Card from 'react-bootstrap/Card'
import React, {useState, useEffect} from 'react'
import Pass from './pass'

import CardDeck from 'react-bootstrap/CardDeck'
const commuter = gql`
{
  commuter{
    status
    code
    ... on CommuterResponse{
      commuter{
        id
        passes
      }
    }
  }
}
`
const initialState = {
  passIds: [],
  loadState: false,
  passListState: false
}
function PassesPage (props){ 
  const {loading, error, data} = useQuery(commuter)
  const [state, setState] = useState(initialState)

  useEffect(() =>{
      setState(state=>{

        if(!loading){
          console.log(data.commuter.commuter)
        return{
          ...state,
          passIds: data.commuter.commuter.passes,
          loadState: true
        }
        }
      })
  },[data])

  if(loading){return (<p>loading...</p>)}
  if(error){return (<p> Error...</p>)}

  const passesList = data.commuter.commuter.passes.map((pass) => {
    return(
    <Pass passId={pass} {...props} />
    )
  })

  return (
    <>
    <div className="container">
      
      <div className="card-deck">
      {passesList}
      </div>
    </div>
    </>
  )
}

export default PassesPage
