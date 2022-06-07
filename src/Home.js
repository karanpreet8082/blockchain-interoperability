import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import logo from './res/blockchain.svg';
import CreateHTLC from './CreateHTLC.js';
import RespondHTLC from './RespondHTLC.js';
import DetailsHTLC from './DetailsHTLC.js';
import WithdrawHTLC from './WithdrawHTLC.js';
import RefundHTLC from './RefundHTLC.js';
import Timeline from './Timeline.js';
import bg from './res/doodle_blockchain.jpg';
class Home extends Component{

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
	 componentWillMount() {
		
		this.styleComponent()
		  }
	styleComponent() {
		document.body.style.backgroundImage = `url(${bg})`;
		document.body.style.backgroundRepeat = "no-repeat";
		document.body.style.backgroundAttachment = "fixed";
		document.body.style.backgroundSize = "cover";
		  }
	render(){
		return(
			<div>
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
				</nav>
					
				  <div class="jumbotron" style={{height:"500px"}}>
				  <h1 className="display-4"><strong>ASSET EXCHANGE STOP</strong>	</h1>
				  <p className="blockquote" style={{textAlign:"justify"}}>This is a one stop solution for Ethereum and Tron Blockchain Interoperability by using HASHED TIME LOCK CONTRACT. Today's 
				  blockchains act as independent distributed ledgers systems and their major limitation is lack of interoperability with other blockchains. So, we are 
				  experimenting with smart contract to achieve inter-operability among chains. It's needed in various sectors like health-care for exchanging data etc.</p>
				  <hr className="my-5"/>
				  <h4 className="my-4">The Future of Cross Chain Coin Swaps</h4>
				   <a className="btn btn-info btn-lg" href="https://cointelegraph.com/explained/blockchain-interoperability-explained" rel="noopener noreferrer" role="button" target="_blank">Learn more</a>
					  
					  </div>
					  <Timeline/>
				
			</div>
		);
	}
}
export default Home;