import {useQuery, gql} from '@apollo/client'
import {useState, useEffect} from 'react'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Image from 'react-bootstrap/Image'
const pass = gql`
  query pass($id: String!){
    pass(id:$id){
      status
      code
      ... on PassResponse{
        pass{
          id
          mediaPath
          value
          purchaseDate
          redeemed
          routeType
          route{
            startStopId
            endStopId
          }
        }
      }
    }
  }

`
 const stops = gql`
{
  stops{
    status
		code
    ... on StopsResponse{
      stops{
        id
        name
        lon
      }
    }
  }
}
`

const initialState = {
  stops: [],
  pass: ''
}

const serverPath = "http://192.168.2.212:5002/static/"
function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center">
          Pass Code
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
            <Image src={serverPath.concat(props.imgPath)} fluid />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}


const Pass = ({props, passId}) => {
  const {loading: stopsLoading, error: stopsError, data: stopsData} = useQuery(stops)
  const {loading: passLoading, error: passError, data: passData} = useQuery(pass, {
    variables: {id: passId}
  })
 const [modalShow, setModalShow] = useState(false);

  if(stopsLoading){return(<p>Loading...</p>)}
  if(stopsError){return(<p>Error...</p>)}
  if(passLoading){return(<p>Loading...</p>)}
  if(passError){return(<p>Error...</p>)}
  console.log(stopsData)
  console.log(passData)
   const getStopName = (id)=>{
    for(const stop of stopsData.stops.stops){
      if(id === stop.id){
        return stop.name
      }
      
    }
      console.log("no match")
      return id
  }


  return(
    <>



    <Card border="primary" style={{ width: '18rem' }}>
    <Card.Header className="text-center"> {passData.pass.pass.routeType} </Card.Header>
    <ListGroup variant="flush">
    <ListGroup.Item>Departure: {getStopName(passData.pass.pass.route.startStopId)}</ListGroup.Item>
    <ListGroup.Item>Arrival: {getStopName(passData.pass.pass.route.endStopId)}</ListGroup.Item>
    <ListGroup.Item><Button variant="primary" onClick={() => setModalShow(true)}>See Pass</Button></ListGroup.Item>
  </ListGroup>
    </Card>

    <MyVerticallyCenteredModal
        imgPath = {passData.pass.pass.mediaPath}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  )

}

export default Pass

