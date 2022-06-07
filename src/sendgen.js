import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3'
import HTLC from "./res/HTLC_Final.json"
import 'bootstrap/dist/css/bootstrap.css';
import 'reactjs-popup/dist/index.css';
//import XLSX from "xlsx";
var price = require('crypto-price');
var Personal = require('web3-eth-personal');
//var wb = XLSX.utils.book_new();
var st = []
const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

class GenerateData extends Component {

  async componentWillMount() {
    await this.loadWeb3()
      await this.loadBlockchainData()
    }
    
    async loadWeb3() {
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
  
    async loadBlockchainData() {
      const web3 = window.web3	
    
    const accounts = await web3.eth.getAccounts()
      this.setState({ account: accounts[0] })
      const networkId = await web3.eth.net.getId()
      this.setState({networkId})
    
      const networkData = HTLC.networks[networkId]
      if(networkData) {
        const htlc = new web3.eth.Contract(HTLC.abi, networkData.address)
        this.setState({ htlc })
        this.setState({ loading: false})
      } else {
        window.alert('SwapContract not deployed to detected network.')
      }
  
    }
 
    constructor(props) {
      super(props)
      this.state = {
        account:'',
        loading:true
      }
    }

  sendFunds=()=>{
let amountFunded = 0.0001;
amountFunded = window.web3.utils.toWei(amountFunded.toString(),'Ether')
const lockTime = 86400;
this.state.htlc.methods.sendFunds("0xB90222ebE2DaD8A4A10AD269750b48DD5256A27C", "0xfd69353b27210d2567bc0ade61674bbc3fc01a558a61c2a0cb2b13d96f9387cd", "0xBEe680b90AE6590be4FB5575869Cab7B814052F9", lockTime, 1).send({ from: this.state.account , value:amountFunded})
.on('transactionHash', function(hash){
console.log(hash)
})
.then(result =>
{
const txId = result.events.fundReceived.returnValues._currentTransactionId

window.alert("Your Unique Transaction Id is : "+ txId)

},e=>{
window.alert("Transaction Failed")
})
  }


  render() {

    return(
        <button onClick={this.sendFunds}>send</button>
    );
  }
}

export default GenerateData;
