import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Image, Alert } from 'react-bootstrap'
import LoadingOverlay from 'react-loading-overlay'
import { BsGear, BsPlusLg} from 'react-icons/bs'
import { RiHeartPulseLine, RiMedicineBottleLine } from "react-icons/ri";
import dateFormat from "dateformat"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_ENDPOINT_PATH } from '../../config'

function ProfileHome() {
 //const [authenticated, setAuthenticated] = useState(false)
 const [profileData, setProfileData] = useState({})
 const [prescriptions, setPrescriptions] = useState([])
 const [working, setWorking] = useState(true)
 const navigate = useNavigate()
 useEffect(() => {
  axios.post(`${API_ENDPOINT_PATH}/api/getProfile`, {}, {
   headers: {
    "x-access-token": localStorage.getItem('token')
   }
  }).then(res => {
    if(!res.data.auth){
     //setAuthenticated(false)
     navigate('/login')
    } else {
     //setAuthenticated(true)
     setProfileData(res.data.user)
     setPrescriptions(res.data.user.prescriptions.filter(item => !item.archived).reverse())
    }
    setWorking(false)
  })
 }, [navigate, working])

 const handleAdd = () => {
  navigate("/take-shot")
}

const handleLogout = () => {
 //setAuthenticated(false)
 localStorage.setItem('token', 'expired')
 navigate('/login')
}

const handleSettings = () => {
 navigate('/settings')
}

const handleArchive = (prescription) => {
 setWorking(true)
 const { _id: prescriptionId, clientId} = prescription
 axios.patch(`${API_ENDPOINT_PATH}/api/prescriptions/${prescriptionId}`, {clientId}, {
  headers: {
   "x-access-token": localStorage.getItem('token')
  }
 }).then(res => {
  setWorking(false)
 }).catch(e => {
   console.log(e)
 })
}

 return (
  <InitialLoader 
   active={working} 
   spinner>
  <div>
   <Row  className={working ? `py-3` :`py-3 bg-secondary`} >
     <Col xs="8">
     <p className="lead">
      Welcome, {profileData.firstName}
      </p>
     </Col>
     <Col xs="4" className="d-flex align-items-center justify-content-end">
      <Button
      className="logout-button"
      variant="secondary"
      size="md"
      onClick={handleLogout}
      >Logout</Button>
      <Button
      className="p-1 settings-button"
      onClick={handleSettings}
      variant="secondary"
      size="lg"
      ><BsGear/></Button>
     </Col>
   </Row>
   <Alert variant='dark' className="text-white bg-secondary border-0 py-3 my-3">
     <Col xs="12">
      <p className="lead">Your Profile</p>
      <p className="text-capitalize">Full Name: <strong>{profileData.firstName} {profileData.lastName}</strong></p>
      <p>
      Phone Number: <strong>{profileData.phoneNumber}</strong></p>
      <p>
      Address: <strong>{profileData.address}</strong></p>
     </Col>
   </Alert>
     {/* prescription box logic starts here */}
     {prescriptions.length === 0 ? <Alert variant='warning'>
      You currently have no prescriptions
     </Alert>: prescriptions.map(prescription => (
        <Row className="p-1 mb-2 bg-black" key={prescription._id}>
        <Col xs="12" className="rounded bg-secondary d-flex align-items-center justify-content-between py-3">
        <Image
             src={prescription.image.url}
             alt="prescription"
             rounded
             width={50}
             height={50}
             style={{ objectFit:'cover' }}
           />
         <div className="d-flex flex-column">
          <small className="d-flex align-items-center"><RiHeartPulseLine className="mr-1"/> BP: {prescription.bloodPressure || 'N/A'}</small>
          <small className="d-flex align-items-center"><RiMedicineBottleLine className="mr-1"/>BG: {prescription.glucoseLevel || 'N/A'}</small>
         </div>
         <div className="d-flex flex-column">
        {/* 'sent', 'quoted', 'paid', 'fullfilled', 'cancelled' */}
        
         {prescription.status === 'sent' && <><small>Status</small><small className="text-success">Sent</small></> }
         {prescription.status === 'quoted' && <><small>Quoted</small><small className="text-warning">R{prescription.quote}</small></> }
         {prescription.status === 'paid' && <><small>Status</small><small className="text-success">Paid</small></> }
         {prescription.status === 'fullfilled' && <><small>Status</small><small className="text-warming">Fullfilled</small></>}
         {prescription.status === 'cancelled' && <><small>Quoted</small><small className="text-warming">Cancelled</small></> }
        
         </div>
         <Button
         size="sm"
         disabled={prescription.status !== 'quoted'}
         >
          Place order
         </Button>
        </Col>
        <Col className="d-flex align-items-center justify-content-between">
          <small className="text-muted">
           {dateFormat(new Date(prescription.createdAt), "ddd d mmmm yyyy @ h:MM TT")}
          </small>
          <div>
          <Button
          onClick={() => handleArchive(prescription)}
          variant='link'
          size="sm"
          >
           Archive
          </Button>
          </div>
        </Col>
        </Row>
      // prescription box ends here
     ))
   
     }
   <Button 
   className="btn-circle"
   onClick={handleAdd}
   >
    <BsPlusLg/>
   </Button>
  </div>
  </InitialLoader>
 )
}

function InitialLoader({ active, children }) {
 return (
   <LoadingOverlay
     spinner
     active={active}
     styles={{
       overlay: (base) => ({
         ...base,
         background: '#343A40',
         minWidth: '100vw',
         minHeight: '100vh'
       })
     }}
   >
     {children}
   </LoadingOverlay>
 )
}

export default ProfileHome
