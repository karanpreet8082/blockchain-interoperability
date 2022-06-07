 import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3'
import HTLC from "./res/HTLC_Final.json"
import 'bootstrap/dist/css/bootstrap.css';
import Identicon from 'react-identicons'
import  Home from "./Home"
import  RefundHTLC from "./RefundHTLC.js"
import RespondHTLC from './RespondHTLC.js';
import DetailsHTLC from './DetailsHTLC.js';
import WithdrawHTLC from './WithdrawHTLC.js';
import logo from './res/blockchain.svg';
import bg from './res/doodle_blockchain.jpg'
import bg1 from './res/navbar.jpg'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import credentials from "./Credentials.json";
var price = require('crypto-price');
const TronWeb = require('tronweb')
const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

class CreateHTLC extends Component {


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
let aScript = document.createElement('script');
aScript.type = 'text/javascript';
aScript.src = "https://smtpjs.com/v3/smtp.js";
document.head.appendChild(aScript);

this.styleComponent()
await this.loadWeb3("Ethereum")
    await this.loadBlockchainData("Ethereum")
  }
 
  componentDidMount() {
 this.senderCrypto = "ETH";
document.getElementById('crypto1').innerHTML = "ETH";  
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

  getConversionRate=async() => {
this.setState({ loading: true})
if(this.senderCrypto === undefined || this.receiverCrypto === undefined) {
window.alert('Please enter valid Blockchain Networks')
}
let obj1 = await price.getCryptoPrice('USD', this.senderCrypto);
let obj2 = await price.getCryptoPrice('USD', this.receiverCrypto);
const temp = (obj1.price/obj2.price);
this.conversionRate = temp;
document.getElementById("crypto1rate").value = 1;
document.getElementById("crypto1rate").readOnly = true;
document.getElementById("crypto2rate").value = temp;
document.getElementById("crypto2rate").readOnly = true;
this.setState({ loading: false})
  }
 
  getKeccakHash=(secret) => {
const keccak256 = require('keccak256');
const secretHash = "0x" + keccak256(secret).toString('hex');
return(secretHash);
  }
 
  sendEmail=(mail, txId) => {
const ele = document.getElementById("receiverChain");
const recvChain = ele.options[ele.selectedIndex].text;
const body = "The transaction Id of the transaction involving your wallet address on "+ this.state.chain +" blockchain (" + this.getNetworkName() +" Network) is "+txId+". You are Requested by sender to send funds on "+ recvChain + " Blockchain ( "+this.receiverNet+" Network ). For more details please visit the website and open 'Respond' tab."
window.Email.send({
Host: credentials.Host,
Username: credentials.Username,
Password: credentials.Password,
To: mail,
From: credentials.From,
Subject: credentials.Subject,
Body: body
})
.then(function (message) {
console.log(message)
});
  }
 
  constructor(props) {
    super(props)
    this.state = {
      account:'',
      loading:true,
 chain:'Ethereum'
    }
  }
 
  getFinalityTime=(chain,network) => {
 if(chain === 'Ethereum' || chain === 'ETH') {
if(network === "Ropsten"){
return 150 //ropsten network time, to be changed as per according to mainnet analysis
}if(network === "Kovan"){
return 60
}if(network === "Rinkeby"){
return 90
}if(network === "Goerli"){
return 120
}
}
else if(chain === 'Tron' || chain === 'TRX') {
if(network === "Shasta Test") {
return 150 //Shasta Test, to be changed
}
else if(network == "TronGrid Main") {
return 150 //TronGrid Main, to be changed
}
else if(network == "TronStack Main") {
return 150 //TronStack Main, to be changed
}
}
  }
 
 
  checkEthAddress(address){
   if(address.length===42 && address[0]==='0' && address[1]==='x'){
      for(let i=2;i<42;i++){
        if(!((address[i]>='0'&& address[i]<='9') || (address[i]>='a' && address[i]<='f') || (address[i]>='A' && address[i]<='F'))){
          return false;
        }
      }
    }else{
      return false;
    }
    return true;
  }

  checkTronAddress(address){
    if(address.length === 34 && address[0]==='T'){
      for(let i=1;i<34;i++){
        if(!((address[i]>='0'&& address[i]<='9') || (address[i]>='a' && address[i]<='z') || (address[i]>='A' && address[i]<='Z'))){
         return false;
        }
      }
    }else{
      return false;
    }
    return true;
  }
 
 
 
  sendFunds=(amountFunded, receiverAddress, expectedAddress, secretHash, amountExpected, receiverEmailId)=>{
    this.setState({ loading: true })
   
    for(var i=0;i< amountFunded.length; i++) {
      if(!((amountFunded[i]>='0' && amountFunded[i]<='9')||amountFunded[i]==='.')){
        window.alert("Invalid Amount Entered")
        this.setState({loading:false})
        return;
      }
    }

if(this.state.chain === "Ethereum")
{
if(this.checkEthAddress(receiverAddress) === false) {
window.alert("Invalid Ethereum Receiver address.");
this.setState({loading:false});
return;
}  
}
else if(this.state.chain === "Tron")
{
if(this.checkTronAddress(receiverAddress) === false){
window.alert("Invalid Tron Receiver address.");
this.setState({loading:false});
return;
}
}

const dropDown = document.getElementById("receiverChain");
const chainName = dropDown.options[dropDown.selectedIndex].text;

if(chainName === "Ethereum")
{
if(this.checkEthAddress(expectedAddress) === false) {
window.alert("Invalid Ethereum Expected address.");
this.setState({loading:false});
return;
}  
}
else if(chainName === "Tron")
{
if(this.checkTronAddress(expectedAddress) === false){
window.alert("Invalid Tron Expected address.");
this.setState({loading:false});
return;
}
}

    if(secretHash.length===66 && secretHash[0]==='0' && secretHash[1]==='x'){
      for(var i=2;i<64;i++){
        if(!((secretHash[i]>='0'&&secretHash[i]<='9') || (secretHash[i]>='a' && secretHash[i]<='f') || (secretHash[i]>='A' && secretHash[i]<='F'))){
          window.alert("Invalid Secret Hash Entered")
          this.setState({loading:false})
          return;
        }
      }
    }else{
      window.alert("Invalid Secret Hash Entered")
      this.setState({loading:false})
      return;
    }

if(emailRegex.test(receiverEmailId) === false) {
 window.alert("Invalid Receiver Email Id Entered")
      this.setState({loading:false})
      return;
}

if(this.state.chain === "Ethereum") {
amountFunded = window.web3.utils.toWei(amountFunded.toString(),'Ether')
}
else if(this.state.chain === "Tron") {
amountFunded = window.tronWeb.toSun(amountFunded)
}
if(this.receiverCrypto === "ETH") {
amountExpected = window.web3.utils.toWei(amountExpected.toFixed(18),'Ether')
}
else if(this.receiverCrypto === "TRX") {
amountExpected = window.tronWeb.toSun(amountExpected.toFixed(6))
}

const lockTime = 900 + 3*Math.max(this.getFinalityTime(this.state.chain,this.getNetworkName()),this.getFinalityTime(this.receiverCrypto,this.receiverNet));

    if(this.state.chain === "Ethereum") {
if(this.receiverCrypto === "TRX") {
expectedAddress = window.tronWeb.address.toHex(expectedAddress)
}
expectedAddress = "0x" + expectedAddress.substring(2);
console.log(expectedAddress)

this.state.htlc.methods.sendFunds(receiverAddress, secretHash, expectedAddress, lockTime, amountExpected).send({ from: this.state.account , value:amountFunded}).then(result =>
{
const txId = result.events.fundReceived.returnValues._currentTransactionId
window.alert("Your Unique Transaction Id is : "+ txId)
this.sendEmail(receiverEmailId, txId)
this.setState({loading:false})
},e=>{
window.alert("Transaction Failed")
this.setState({loading:false})
})
}
else if(this.state.chain === "Tron") {
this.state.htlc.methods.sendFunds(receiverAddress, secretHash, expectedAddress, lockTime, amountExpected).send({ from: this.state.account , callValue:amountFunded, shouldPollResponse: true}).then((res) => {
const txId = parseInt(res["txId"]._hex)
window.alert("Your Unique Transaction Id is : "+ txId)
this.sendEmail(receiverEmailId, txId)
this.setState({loading:false});
},e=>{
window.alert("Transaction Failed")
this.setState({loading:false})
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

this.senderCrypto = e.target.value;
document.getElementById('crypto1').innerHTML = e.target.value;
if(this.receiverCrypto!== undefined) {
this.getConversionRate();
}
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

getNetworkOptions(chain) {
const selectEle = document.getElementById("receiverNetwork");
while(selectEle.options.length!=1) {
selectEle.remove(selectEle.options.length -1);
}
if(chain === "ETH") {
let opt = document.createElement("option");
opt.text = "Ropsten";
selectEle.add(opt);
opt = document.createElement("option");
opt.text = "Rinkeby";
selectEle.add(opt);
opt = document.createElement("option");
opt.text = "Goerli";
selectEle.add(opt);
opt = document.createElement("option");
opt.text = "Kovan";
selectEle.add(opt);
}
else if(chain === "TRX") {
let opt = document.createElement("option");
opt.text = "Shasta Test";
selectEle.add(opt);
}
}

  render() {
let acc = this.state.account;
acc = acc.slice(0,5) + "...." + acc.slice(-4)
    return (
      <div>
 
        <nav className="navbar navbar-expand-lg navbar-dark border-bottom border-light" style={{backgroundColor:'#1c1e1f'}}>
<a className="navbar-brand">
<img src={logo} onClick={this.renderHome}  style={{cursor:"pointer"}} width="60" height="50" alt="ETHEREUM EXCHANGE"/>
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
<div className="container">
<div className="row">
<main role="main" className="col-lg-12 text-center">
<div className="content mr-auto ml-auto colour-red">
<h5 className="mt-2 text-dark" align="center" ><strong>You Are Transferring On {this.getNetworkName()} Network</strong></h5>
{  
this.state.loading ? <div id="loader" style={{zIndex: '1'}} className="spinner-border text-primary text-center"></div> : null
}  
<div style={{display: 'flex', flexDirection: 'column', filter: this.state.loading?'blur(1px)':''}}>
                    <form onSubmit={(event) => {
                      event.preventDefault()
 const receiverEmailId = this.receiverEmailId.value
 const secretHash = this.secretHash.value
 const amountFunded = this.fundAmount.value
 const amountExpected = this.conversionRate * amountFunded
                      const receiverAddress = this.addressOfReceiver.value
                      const expectedAddress = this.expectedAddress.value
                      this.sendFunds(amountFunded, receiverAddress, expectedAddress, secretHash, amountExpected, receiverEmailId)
                    }}>

<div className="form-group my-4">
                        <div className="float-left">Receiver Blockchain</div>
<select class="form-control" id="receiverChain" onChange={(e) => {this.receiverCrypto = e.target.value; document.getElementById('crypto2').innerHTML = e.target.value; this.getNetworkOptions(e.target.value); if(this.senderCrypto!== undefined){this.getConversionRate();}}} >
<option selected disabled>Select Network...</option>
<option value='ETH'>Ethereum</option>
<option value='TRX'>Tron</option>
</select>
<small className="form-text text-muted">Blockchain on which you want to receive Funds</small>
</div>

<div className="input-group">
<input id='crypto1rate' type="text" className="form-control" />
<span id='crypto1' className="input-group-text"></span>
<span className="input-group-text">=</span>
<input id='crypto2rate' type="text" className="form-control" readonly />
<span id='crypto2' className="input-group-text" style={{borderLeft: "0", borderRight: "0"}}></span>
</div>

<div className="form-group my-4">
                        <div className="float-left">Receiver Network</div>
<select class="form-control" id="receiverNetwork" onChange={(e) => {this.receiverNet = e.target.value;}} >
<option selected disabled>Select Network...</option>
</select>
<small className="form-text text-muted">Network on which you want to receive Funds</small>
</div>

                    <div className="form-group my-4">
<div className="float-left">Amount</div>
<input id="fundAmount" className="form-control" type="text" placeholder="Amount Of Funds You Want To Send" ref={(input) => { this.fundAmount = input }} required />
                    </div>
 
<div className="form-group my-4">
                        <div className="float-left">Secret Hash</div>
<div className="float-right">
<Popup trigger={<button id='popupBtn' class="btn btn-sm"><i class="fa fa-fw fa-question-circle"></i></button>} position="bottom right">
<div >
<input type='text' placeholder='Enter your secret key' onChange={(e) => {document.getElementById('keccakHash').textContent = this.getKeccakHash(e.target.value)}}></input>
<p style={{overflow: 'hidden', whiteSpace: 'nowrap', width: '100%',textOverflow: 'ellipsis'}} id='keccakHash'></p>
<p>  Click<button  class="btn btn-sm" onClick={() => {document.getElementById('secretHash').value = document.getElementById('keccakHash').textContent;document.getElementById('popupBtn').click()}}><i class="fa fa-fw fa-copy"></i></button>to copy hash</p>
</div>
</Popup>
</div>
<input id="secretHash" className="form-control" type="text" placeholder="Hash Value of the Secret key using Keccak256 function" ref={(input) => { this.secretHash = input }} required />
                    </div>

<div className="form-group my-4">
<div className="float-left">Receiver Address</div>
<input id="addressOfReceiver" className="form-control" type="text" placeholder="Address Of Receiver Wallet (On The Same Network)" ref={(input) => { this.addressOfReceiver = input }} required />
                        <small className="form-text text-muted">Receiver Address On Same Network That They Asked You To Send Funds On</small>
                    </div>
 
                    <div className="form-group my-4">
<div className="float-left">Expected Address</div>
                        <input id="expectedAddress" className="form-control" type="text" placeholder="Address Of Your Wallet (On The Other Network)" ref={(input) => { this.expectedAddress = input }} required />
<small className="form-text text-muted">The Other Person Is Expected To Send The Funds On This Address On Other Network</small>
                    </div>
                   
<div className="form-group my-4">
<div className="float-left">Email Id of Receiver</div>
                        <input id="email" className="form-control" type="email" placeholder="Enter Receiver's Email Id " ref={(input) => { this.receiverEmailId = input }} required />
                    </div>

<button style = {{fontSize:20}} className = "btn btn-info btn-sm my-4">Send Funds</button>
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

export default CreateHTLC;
