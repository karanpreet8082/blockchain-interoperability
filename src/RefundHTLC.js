import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3'
import HTLC from "./res/HTLC_Final.json"
import 'bootstrap/dist/css/bootstrap.css';
import Identicon from 'react-identicons'
import  Home from "./Home"
import CreateHTLC from './CreateHTLC.js';
import RespondHTLC from './RespondHTLC.js';
import DetailsHTLC from './DetailsHTLC.js';
import WithdrawHTLC from './WithdrawHTLC.js';
import logo from './res/blockchain.svg';
import bg from './res/doodle_blockchain.jpg'
import 'reactjs-popup/dist/index.css';

function myFunctionKeyShow(){

  var x = document.getElementById("secretKey");
    if (x.type === "password"){
      x.type = "text";
    } else{
      x.type = "password";
    }
}

class RefundHTLC extends Component {


  renderHome(){
    ReactDOM.render(<Home />, document.getElementById('root'));
  }

  renderCreateHTLC(){
    ReactDOM.render(<CreateHTLC />, document.getElementById('root'));
  }
 
  renderRespondHTLC(){
ReactDOM.render(<RespondHTLC />, document.getElementById('root'));
  }

  renderDetailsHTLC(){
    ReactDOM.render(<DetailsHTLC />, document.getElementById('root'));
  }
 
  renderWithdrawHTLC() {
ReactDOM.render(<WithdrawHTLC />, document.getElementById('root'));
  }
 
  renderRefundHTLC(){
    ReactDOM.render(<RefundHTLC />, document.getElementById('root'));
  }

  async componentWillMount() {
this.styleComponent();
await this.loadWeb3()
    await this.loadBlockchainData()
  }

  styleComponent() {
document.body.style.backgroundImage = `url(${bg})`;
document.body.style.backgroundRepeat = "no-repeat";
document.body.style.backgroundAttachment = "fixed";
document.body.style.backgroundSize = "cover";
  }
 
  async loadWeb3() {
    const network = this.state.chain
 if(network === 'Ethereum') {
if (window.ethereum) {
window.web3 = new Web3(window.ethereum)
await window.ethereum.enable()
}
else if (window.web3) {
window.web3 = new Web3(window.web3.currentProvider)
}
else {
window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
}
 }
 
 else if(network === 'Tron') {
if(window.tronWeb) {
console.log("Tronlink present")
}
else {
window.alert('Tron wallet not detected. You should consider trying Tronlink!')
}
 }

  }

  async loadBlockchainData() {
    const network = this.state.chain
 if(network === 'Ethereum') {
const web3 = window.web3
const accounts = await web3.eth.getAccounts()
this.setState({ account: accounts[0] })
const networkId = await web3.eth.net.getId()
this.setState({networkId})

const networkData = HTLC.networks[networkId]
if(networkData) {
const htlc = new web3.eth.Contract(HTLC.abi, networkData.address)
this.setState({ htlc })
} else {
window.alert('SwapContract not deployed to detected network.')
}

this.setState({ loading: false})
 }
 
 else if(network=== 'Tron') {
 const account = window.tronWeb.defaultAddress.base58
 if(!account) {
 window.alert("Some error occured. Please try signing in again to TronLink.");
 }
else {
this.setState({ account: account })
const network = window.tronWeb.fullNode.host
if(network.includes("shasta")) {
this.setState({networkId : 101});
const htlc = await window.tronWeb.contract().at(HTLC.networks["101"].address)
this.setState({ htlc })
}
else if(network.includes("trongrid")) {this.setState({networkId : 2})}
else if(network.includes("tronstack")) {this.setState({networkId : 3})}
else {window.alert("Network not supported. Please switch to some other network of Tron")}
}
this.setState({loading: false})
 }

  }
 
  constructor(props) {
    super(props)
    this.state = {
      account:'',
      loading:true,
 chain:'Ethereum'
    }
  }
 
  initiateRefunds=(transactionId)=>{

    this.setState({ loading: true })
    for(var i=0; i< transactionId.length;i++){
      if(!(transactionId[i]>='0' && transactionId[i]<='9')){
        window.alert("Wrong Transaction Id")
        this.setState({loading:false})
        return;
      }
    }
if(this.state.chain === "Ethereum") {
this.state.htlc.methods.refund(transactionId).send({from:this.state.account}).then(result=>
{
window.alert("Refund is initiated")
this.setState({loading : false})
},e=>{
window.alert("Refund Failed")
this.setState({loading : false})
})
}
else if(this.state.chain === "Tron") {
this.state.htlc.methods.refund(transactionId).send({from:this.state.account, shouldPollResponse: true}).then(result=>
{
window.alert("Refund is initiated")
this.setState({loading : false})
},e=>{
window.alert("Refund Failed")
this.setState({loading : false})
})
}

  }
 
  getNetworkName(){
  if(this.state.chain === 'Ethereum') {
if(this.state.networkId === 3){
return "Ropsten"
}if(this.state.networkId === 42){
return "Kovan"
}if(this.state.networkId === 4){
return "Rinkeby"
}if(this.state.networkId === 5){
return "Goerli"
}if(this.state.networkId === 5777){
return "Ganache"
}
}
else if(this.state.chain === 'Tron') {
if(this.state.networkId === 101) {
return "Shasta Test"
}
else if(this.state.networkId == 2) {
return "TronGrid Main"
}
else if(this.state.networkId == 3) {
return "TronStack Main"
}

}
}


linkAccount=async(e)=> {
e.preventDefault();

const dropDown = document.getElementById("accountSelect");
const chainName = dropDown.options[dropDown.selectedIndex].text
this.setState({chain : chainName})

await this.loadWeb3()
    await this.loadBlockchainData()
}

selectAccountOption() {
return(
<select id="accountSelect" style={{marginLeft: "10px",maxWidth: "120px"}} class="form-control" onChange={this.linkAccount} >
<option value='ETH' >Ethereum</option>
<option value='TRX'>Tron</option>
</select>
);
}

  render() {
let acc = this.state.account;
acc = acc.slice(0,5) + "...." + acc.slice(-4)
    return (
      <div >
 
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-light" style={{backgroundColor:'#1c1e1f'}}>
<a className="navbar-brand">
<img src={logo} onClick={this.renderHome} style={{cursor:"pointer"}} width="60" height="50" alt="ETHEREUM EXCHANGE"/>
</a>
<h2 class='text-white text-center' align='center'>HTLC</h2>
<div className="collapse navbar-collapse" id="navbarNavAltMarkup">
<div className="navbar-nav mr-auto">
<button className="btn btn-info btn-lg mx-3" onClick={this.renderCreateHTLC}>Create</button>
   <button className="btn btn-info btn-lg mx-3" onClick={this.renderRespondHTLC}>Respond</button>
   <button className="btn btn-info btn-lg mx-3" onClick={this.renderDetailsHTLC}>Details</button>
   <button className="btn btn-info btn-lg mx-3" onClick={this.renderWithdrawHTLC}>Withdraw</button>
   <button className="btn btn-info btn-lg mx-3" onClick={this.renderRefundHTLC}>Refund</button>
</div>
</div>  
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <span className='text-white' id="account">{acc}</span>
            </li>
          </ul>
          {
          this.state.account ?  <Identicon string={this.state.account} size='30'/>: <span></span>
            }
{
this.selectAccountOption()
}
        </nav>



<div style={{paddingTop : "2%",paddingBottom : "2%"}}>
        <div class="card bg-light" style={{ width: '40%', marginLeft: '58%'}}>
<div class="card-body">
<div className="container" >
          <div className="row">
            <main role="main" className="col-lg-12 text-center">
              <div className="content mr-auto ml-auto colour-red">
                <h5 className="mt-2 text-dark" align="center" ><strong>You Are Transferring On {this.getNetworkName()} Network</strong></h5>
{  
this.state.loading ? <div id="loader" style={{zIndex: '1'}} className="spinner-border text-primary text-center"></div> : null
}
                <div style={{filter: this.state.loading?'blur(1px)':''}}>
                    <form onSubmit={(event) => {
                      event.preventDefault()
                      var transactionId = this.transactionId.value
 this.initiateRefunds(transactionId)
                    }}>

                        <div className="form-group my-4" style={{paddingTop: "20px"}}>
<div className="float-left">Transaction Id</div>
                        <input
                          id="transactionId"
                          type="text"
                          ref={(input) => { this.transactionId = input }}
                          className="form-control"
                          placeholder="Enter Transaction Id."
                          required />
 <small className="form-text text-muted">Note: Funds can Only Be Claimed after the expiry of Time Lock.</small>
                      </div>


                      <button
                        style = {{fontSize:20}}
className = "btn btn-info btn-sm my-4">
                          Claim Refund
                      </button>
                    </form>
                   
                  </div>
              </div>
            </main>
          </div>
        </div>
</div>
</div>
        </div>
</div>
    );
}
}

export default RefundHTLC;