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
          redeemDate
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

const serverPath = "http://ec2-3-96-167-170.ca-central-1.compute.amazonaws.com/static/"
function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
    size="md"
      centered
    >
       <Modal.Header closeButton>
        <Modal.Title className="text-center">
          Pass
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
const convertDate = (date)=>{
  var tempDate = new Date(date)

return tempDate.toDateString()
}

const redeemedPass = (pass) =>{
  if(pass){
    return(
        <ListGroup.Item className="text-center redeemedPass">
      <small className=" text-white">Redeemed </small>
 <small className="text-white">{" " + convertDate(passData.pass.pass.redeemDate) }</small>
     </ListGroup.Item >

  
    )
  }
  return(
  <ListGroup.Item className="text-center activePass">
      <small className=" text-white">Active</small>
    </ListGroup.Item>

  )

}

  return(
    <>

    <div className="passes">
    <Card className="sBox">
    <Card.Header className="text-center secondaryGradient white-text"> {passData.pass.pass.routeType} </Card.Header>
    <ListGroup >
    <ListGroup.Item>Departure: {getStopName(passData.pass.pass.route.startStopId)}</ListGroup.Item>
    <ListGroup.Item>Arrival: {getStopName(passData.pass.pass.route.endStopId)}</ListGroup.Item>
    <ListGroup.Item className="text-center"><Button className="secondaryGradient" onClick={() => setModalShow(true)}>See Pass</Button></ListGroup.Item>
  </ListGroup>
    <ListGroup.Item className="text-center">
      <small className=" whiteBG">Purchased {" " + convertDate(passData.pass.pass.purchaseDate) }</small>
    </ListGroup.Item>
    {redeemedPass(passData.pass.pass.redeemed)}
    </Card>
</div>
    <MyVerticallyCenteredModal
        imgPath = {passData.pass.pass.mediaPath}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  )

}

export default Pass

