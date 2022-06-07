import React, { Component } from 'react';
import './Timeline.css';
import logo from './res/logo.jpg'
import create from './res/create.jpg'
import refund from './res/refund.png'
import details from './res/details.png'
import withdraw from './res/withdraw.jpg'
import respond from './res/respond.jpg'

class Timeline extends Component {
render() {
return(
<div class="container">
  <div class="row">
    <div class="col-lg-12">
     
      <ul class="timeline">
        <li>
          <div class="timeline-image">
            <img src={create} style={{width: "100%", height: "auto", borderRadius: "50%"}} alt=""/>
          </div>
          <div class="timeline-panel">
 
 <div class="card " style={{backgroundColor:"#e9ecef" ,borderRadius: "10%"}} >
<div class="card-body">
<div className="container">

            <div class="timeline-heading">
              <h4 style={{textAlign: 'center'}}>Create</h4>
              <h4 class="subheading" style={{textAlign: 'center'}}>Initiate HTLC</h4>
            </div>
            <div class="timeline-body">

              <p class="text-muted" style={{textAlign: 'justify'}}>
 One of the two users (say user A) initiate the HTLC for the exchange. Lets say the exchange is such that User A sending funds on Blockchain A and User B on Blockchain B. To create HTLC User A need to know the blockchain B 's details, wallet address of User B in Blockchain A, email Id of user B.
             </p>
            </div>
          </div>
 </div>
 </div>
 </div>
 
 
          <div class="line"></div>
        </li>
        <li class="timeline-inverted">
          <div class="timeline-image">
            <img class="img-circle img-responsive" src={respond} style={{width: "100%", height: "auto", borderRadius: "50%"}} alt=""/>
          </div>
          <div class="timeline-panel">
            <div class="card " style={{backgroundColor:"#e9ecef",borderRadius: "10%"}}>
<div class="card-body">
<div className="container">

            <div class="timeline-heading">
              <h4 style={{textAlign: 'center'}}>Respond</h4>
              <h4 class="subheading" style={{textAlign: 'center'}}>Respond to HTLC Initiation</h4>
            </div>
            <div class="timeline-body">

              <p class="text-muted" style={{textAlign: 'justify'}}>
                Considering User A created HTLC, User B will get email after the contract creation specifying Blockchain A 's details and transaction Id. User B need to go to "Respond" page and enter the details. User B additionally need User A 's email address, rest everything is autofilled for next step.  
              </p>
            </div>
          </div>
 </div>
 </div>
 
          </div>
          <div class="line"></div>
        </li>
        <li>
          <div class="timeline-image">
            <img class="img-circle img-responsive" src={withdraw} style={{width: "100%", height: "auto", borderRadius: "50%"}} alt=""/>
          </div>
          <div class="timeline-panel">
            <div class="card" style={{backgroundColor:"#e9ecef",borderRadius: "10%"}}>
<div class="card-body">
<div className="container">

            <div class="timeline-heading">
              <h4 style={{textAlign: 'center'}}>Withdraw</h4>
              <h4 class="subheading" style={{textAlign: 'center'}}>Withdraw your funds</h4>
            </div>
            <div class="timeline-body">

              <p class="text-muted" style={{textAlign: 'justify'}}>
              Now that both parties have funded the respective amounts. The next step is to withdraw the funds. First User A initiate withdraw, by going to "Withdraw" page and switching to Blockchain B on website. Secret key is known to User A, Transaction Id will be emailed to User A. Next User B withdraws in the similar way but secret key will be mailed and transaction Id is already known.
 </p>
            </div>
          </div>
 </div>
 </div>
 
          </div>
          <div class="line"></div>
        </li>
        <li class="timeline-inverted">
          <div class="timeline-image">
            <img class="img-circle img-responsive" src={refund} style={{width: "100%", height: "auto", borderRadius: "50%"}} alt=""/>
          </div>
          <div class="timeline-panel">
            <div class="card" style={{backgroundColor:"#e9ecef",borderRadius: "10%"}}>
<div class="card-body">
<div className="container">

            <div class="timeline-heading">
              <h4 style={{textAlign: 'center'}}>Refund</h4>
              <h4 class="subheading" style={{textAlign: 'center'}}>Get Refund in case of failure</h4>
            </div>
            <div class="timeline-body">

              <p class="text-muted" style={{textAlign: 'justify'}}>
              In case of any kind of failure due to which exchange couldn't happend. The refunds can be initiated by User A and B in their respective Blockchains only after the expiry of some specified time. Users would require the transaction Id on their blockchains to initiate refund.
 </p>
            </div>
          </div>
 </div>
 </div>
 
          </div>
          <div class="line"></div>
        </li>
        <li>
          <div class="timeline-image">
            <img class="img-circle img-responsive" src={details} style={{width: "100%", height: "auto", borderRadius: "50%"}} alt=""/>
          </div>
          <div class="timeline-panel">
            <div class="card" style={{backgroundColor:"#e9ecef",borderRadius: "10%"}}>
<div class="card-body">
<div className="container">

            <div class="timeline-heading">
              <h4 style={{textAlign: 'center'}}>Details</h4>
              <h4 class="subheading" style={{textAlign: 'center'}}>See Details of Transaction</h4>
            </div>
            <div class="timeline-body">

              <p class="text-muted" style={{textAlign: 'justify'}}>
              To see the details of the transaction at any point in time, users can go to "Details" page, enter the blockchain details and transaction Id for which information is to be fetched.
 </p>
            </div>
          </div>
 </div>
 </div>
 
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>
);
}
}
export default Timeline;