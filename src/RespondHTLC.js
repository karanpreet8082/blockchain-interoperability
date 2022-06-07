import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3'
import HTLC from "./res/HTLC_Final.json"
import 'bootstrap/dist/css/bootstrap.css';
import Identicon from 'react-identicons'
import  Home from "./Home"
import  RefundHTLC from "./RefundHTLC.js"
import CreateHTLC from './CreateHTLC.js';
import DetailsHTLC from './DetailsHTLC.js';
import WithdrawHTLC from './WithdrawHTLC.js';
import logo from './res/blockchain.svg';
import bg from './res/doodle_blockchain.jpg'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import credentials from "./Credentials.json";
const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

class RespondHTLC extends Component {


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
 
  sendEmail=(mail, txId) => {
const body = "The transaction Id of the transaction involving your wallet address on "+ this.state.chain +" blockchain (" + this.getNetworkName() +" Network) is "+txId+ ". Please visit the website and click on 'Withdraw' tab to initiate withdraw Transaction"
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
 detailsFetched: false,
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
 
  hexAddressToBase58 = (hexAddress) => {
            const HEX_PREFIX = '41';
            let retval = hexAddress;
            try {
                let tronWeb = window.tronWeb;
                if (hexAddress.startsWith("0x")) {
                    hexAddress = HEX_PREFIX + hexAddress.substring(2);
                }
                let bArr = tronWeb.utils['code'].hexStr2byteArray(hexAddress);
                retval = tronWeb.utils['crypto'].getBase58CheckAddress(bArr);
                console.log(retval);
            } catch (e) {
                //Handle
            }
            return retval;
        }
 
 
  getDetails=async(blockchain, network, txId) => {
   if(blockchain === 'Ethereum')
    {
    var swapcontract2;
    var account2
    this.setState({loading: true});
    var web3;
    if(network==="Ropsten"){
      web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/5e1a5f57f69140109fed2374eddfdaba"));
      swapcontract2 = new web3.eth.Contract(HTLC.abi,HTLC.networks[3].address);
      account2 = HTLC.networks[3].address;
    }
    else if(network==="Rinkeby"){
      web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/5e1a5f57f69140109fed2374eddfdaba"));
      swapcontract2 = new web3.eth.Contract(HTLC.abi,HTLC.networks[4].address);
      account2 = HTLC.networks[4].address;
    }
    else if(network === "Kovan"){
      web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/v3/5e1a5f57f69140109fed2374eddfdaba"));
      swapcontract2 = new web3.eth.Contract(HTLC.abi,HTLC.networks[42].address);
      account2 = HTLC.networks[42].address;
    }
    else if(network === "Goerli"){
      web3 = new Web3(new Web3.providers.HttpProvider("https://goerli.infura.io/v3/5e1a5f57f69140109fed2374eddfdaba"));
      swapcontract2 = new web3.eth.Contract(HTLC.abi,HTLC.networks[5].address);
      account2 = HTLC.networks[5].address;
    }
   
    var account1 = this.state.account;
    const acc =  await window.web3.eth.getAccounts();
    console.log(acc);
    swapcontract2.methods.getAmountDetails(txId).call({from: acc[0]}).then(res1 => {
        swapcontract2.methods.getAddressDetails(txId).call({from: acc[0]}).then(res2 => {
            swapcontract2.methods.getSecretDetails(txId).call({from: acc[0]}).then(res3 => {
                this.details = {
                    ...res1,
                    ...res2,
                    ...res3
                };
                if(this.state.chain === 'Ethereum')
                {
                this.details['amountExpected'] = window.web3.utils.fromWei(this.details['amountExpected'],'ether');
               
                }
                else if(this.state.chain === "Tron")
                {
                    this.details['amountExpected'] = window.tronWeb.fromSun(this.details['amountExpected']);
                }

                if(blockchain === 'Ethereum')
                {
                    this.details['amountFunded'] = window.web3.utils.fromWei(this.details['amountFunded'],'ether');
                }
                else if(blockchain === "Tron")
                {
                    this.details['amountFunded'] = window.tronWeb.fromSun(this.details['amountFunded']);
                }

               
                if(this.state.chain === "Tron")
                {
                   this.details['expectedAddress'] =  this.hexAddressToBase58(this.details['expectedAddress']);
                }

                this.setState({loading:false})
                this.setState({detailsFetched: true});
            },e=>{
                window.alert("Unable to Fetch Details, Please Try again!")
                this.setState({loading:false})
            });
        },e=>{
            window.alert("Unable to Fetch Details, Please Try again!")
            this.setState({loading:false})
        });
    },e=>{
      window.alert("Unable to Fetch Details, Please Try again!")
      this.setState({loading:false})
    });
}
else if(blockchain === "Tron")
{

    this.setState({loading: true});
    const account = window.tronWeb.defaultAddress.base58;
    const htlcTron = await window.tronWeb.contract().at(HTLC.networks["101"].address)
htlcTron.methods.getAmountDetails(txId).call().then(res1 => {
        htlcTron.methods.getAddressDetails(txId).call().then(res2 => {
            htlcTron.methods.getSecretDetails(txId).call().then(res3 => {
                this.details = {
                    ...res1,
                    ...res2,
                    ...res3
                };
            this.details['amountFunded'] = parseInt(this.details['amountFunded']._hex).toString();
            this.details['amountExpected'] = parseInt(this.details['amountExpected']._hex).toString();
            this.details['owner'] = this.hexAddressToBase58(this.details['owner']);
            this.details['recipient'] = this.hexAddressToBase58(this.details['recipient']);
           
           
            console.log(this.details);            
              if(this.state.chain === 'Ethereum')
                {
                this.details['amountExpected'] = window.web3.utils.fromWei(this.details['amountExpected'],'ether');
               
                }
                else if(this.state.chain === "Tron")
                {
                    this.details['amountExpected'] = window.tronWeb.fromSun(this.details['amountExpected']);
                }

                if(blockchain === 'Ethereum')
                {
                    this.details['amountFunded'] = window.web3.utils.fromWei(this.details['amountFunded'],'ether');
                }
                else if(blockchain === "Tron")
                {
                    this.details['amountFunded'] = window.tronWeb.fromSun(this.details['amountFunded']);
                }

                if(this.state.chain === "Ethereum")
                {
                    this.details['expectedAddress'] = window.tronWeb.address.toHex(this.details['expectedAddress']);
                    this.details['expectedAddress'] = "0x" + this.details['expectedAddress'].substring(2);
                }
                else if(this.state.chain === 'Tron') 
                {
                  this.details['expectedAddress'] = this.hexAddressToBase58(this.details['expectedAddress']);
                }
                this.setState({loading:false})
                this.setState({detailsFetched: true});
            },e=>{
                window.alert("Unable to Fetch Details, Please Try again!")
                this.setState({loading:false})
            });
        },e=>{
            window.alert("Unable to Fetch Details, Please Try again!")
            this.setState({loading:false})
        });
    },e=>{
      window.alert("Unable to Fetch Details, Please Try again!")
      this.setState({loading:false})
    });
}
  }
 
  sendFunds=(amountFunded, receiverAddress, expectedAddress, secretHash, amountExpected, receiverEmailId)=>{
    this.setState({ loading: true })
   
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
  if(this.senderChain === "Ethereum") {
  amountExpected = window.web3.utils.toWei(amountExpected,'Ether')
  }
  else if(this.senderChain === "Tron") {
  amountExpected = window.tronWeb.toSun(amountExpected)
  }
  
const lockTime = 300 + this.getFinalityTime(this.state.chain,this.getNetworkName());

    if(this.state.chain === "Ethereum") {

if(this.senderChain === "Tron") {
expectedAddress = window.tronWeb.address.toHex(expectedAddress)
}
expectedAddress = "0x" + expectedAddress.substring(2);
//console.log(expectedAddress)
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

generateAutoFilledForm() {
//console.log(this.details)
if(this.details['completed']) {
window.alert("Transaction Already Completed.");
return(this.generateGetDetailsForm());
}

else if(this.details['refunded']) {
window.alert("Transaction Refunded by Other User");
return(this.generateGetDetailsForm());
}

return(
<form onSubmit={(event) => {
                      event.preventDefault()
 const receiverEmailId = this.receiverEmailId.value
                      this.sendFunds(this.details['amountExpected'],this.details['expectedAddress'], this.details['recipient'], this.details['secretHash'], this.details['amountFunded'], receiverEmailId)
                    }}>

                    <div className="form-group my-4">
<div className="float-left">Amount to be funded</div>
<input className="form-control" type="text" value={this.details['amountExpected']} readOnly />
                    </div>

<div className="form-group my-4">
<div className="float-left">Amount you will get</div>
<input className="form-control" type="text" value={this.details['amountFunded']} readOnly />
                    </div>
 
<div className="form-group my-4">
                        <div className="float-left">Secret Hash</div>
<input className="form-control" type="text" value={this.details['secretHash']} readOnly/>
                    </div>

<div className="form-group my-4">
<div className="float-left">Receiver Address</div>
<input className="form-control" type="text" value={this.details['expectedAddress']} readOnly/>
                        <small className="form-text text-muted">Receiver Address On Same Network That They Asked You To Send Funds On</small>
                    </div>
 
                    <div className="form-group my-4">
<div className="float-left">Your Expected Address</div>
                        <input className="form-control" type="text" value={this.details['recipient']} readOnly/>
<small className="form-text text-muted">The Other Person will Send The Funds On This Address On Other Network</small>
                    </div>
                   
<div className="form-group my-4">
<div className="float-left">Email Id of Receiver</div>
                        <input id="email" className="form-control" type="email" placeholder="Enter Receiver's Email Id " ref={(input) => { this.receiverEmailId = input }} required />
                    </div>

<button style = {{fontSize:20}} className = "btn btn-dark btn-sm my-4">Send Funds</button>
        </form>

);
}

getNetworkOptions() {
if(this.senderChain === "Ethereum") {
return(
["Select Network...",
"Ropsten",
"Rinkeby",
"Goerli",
"Kovan"]
);
}
else if(this.senderChain === "Tron"){
return (
["Select Network...",
"Shasta Test"]
);
}
else {
return([]);
}
}

generateGetDetailsForm() {
return(
<form onSubmit={(event) => {
                      event.preventDefault()
 this.getDetails(this.senderChain,this.senderNetwork,this.transactionId.value);
                    }}>
<div className="form-group my-4" >
                        <div className="float-left">Sender's Blockchain</div>
<select class="form-control" id="senderChain" onChange={(e) => {this.senderChain = e.target.options[e.target.options.selectedIndex].innerHTML;this.setState({loading: false})}} >
<option selected disabled>Select Network...</option>
<option value='ETH'>Ethereum</option>
<option value='TRX'>Tron</option>
</select>
<small className="form-text text-muted">Blockchain Name on which sender sent funds for you</small>
</div>

<div className="form-group my-4" >
                        <div className="float-left">Sender's Network</div>
<select class="form-control" id="senderNetwork" onChange={(e) => {this.senderNetwork = e.target.options[e.target.options.selectedIndex].innerHTML}} >

{this.getNetworkOptions().map((item) =>{
if(item === "Select Network...") {
return(
<option selected disabled>{item}</option>
);
}
else{
return(
<option>{item}</option>
);
}
} )}
</select>
<small className="form-text text-muted">Blockchain Network on which sender sent funds for you</small>
</div>

                    <div className="form-group my-4" >
<div className="float-left">Transaction Id</div>
<input className="form-control" type="text" placeholder="Transaction Id" ref={(input) => { this.transactionId = input }} required />
                    </div>

<button style = {{fontSize:20}} className = "btn btn-info btn-sm my-4">Submit</button>
        </form>
);
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
      <div>
 
        <nav className="navbar navbar-expand-lg navbar-dark border-bottom border-light" style={{backgroundColor:'#1c1e1f'}}>
<a className="navbar-brand">
<img src={logo} onClick={this.renderHome} width="60" height="50" alt="ETHEREUM EXCHANGE"/>
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
<div style={{filter: this.state.loading?'blur(1px)':''}}>
{
this.state.detailsFetched?this.generateAutoFilledForm():this.generateGetDetailsForm()
                    }
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

export default RespondHTLC;