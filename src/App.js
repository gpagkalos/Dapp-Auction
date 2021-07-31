import React, { Component } from "react";
import AuctionContract from "./contracts/Auction.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { theHighestBid: 0, 
  web3: null, 
  accounts: null, 
  contract: null, 
  bidvalue: null,
  theHighestBidder: null,
  contractBalance: 0
  
};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AuctionContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AuctionContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  bid = async () => {
    const { accounts, contract, web3 } = this.state;

    await contract.methods.bid().send({ from: accounts[0], value: web3.utils.toWei(this.state.bidvalue,"finney") });

  };

  withdraw = async () => {
    const { accounts, contract, } = this.state;

    await contract.methods.withdraw().send({ from: accounts[0]});

  };

  getHighestBidder = async () => {
    const contract  = this.state.contract;

    const response = await contract.methods.highestBidder().call();
    this.setState({ theHighestBidder: response });

  };

  getHighestBid = async () => {
    const contract  = this.state.contract;

    const response = await contract.methods.highestBid().call();
    this.setState({ theHighestBid: response });

  };

  getContractBalance =  async () => {
    const contract  = this.state.contract;

    const response = await contract.methods.getContractBalance().call();
    this.setState({ contractBalance: response });

  };

  setBidValue = (event) => {
    this.setState({bidvalue: event.target.value},()=>{
      console.log(this.state.bidvalue)
    });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    let infobidder
    if (this.state.theHighestBidder == null){
      infobidder=""
    }
    else{
      infobidder=<div> public address: {this.state.theHighestBidder}</div>
    }

    let infobid
    if (this.state.theHighestBid === 0){
      infobid=""
    }
    else{
      infobid=<div> highest Bid in Wei: {this.state.theHighestBid}</div>
    }
    let infocontractBalance
    if (this.state.contractBalance === 0){
      infocontractBalance=""
    }
    else{
      infocontractBalance=<div>{this.state.contractBalance}</div>
    }

    return (
      <div className="App">
        <h1>Auction</h1>
        <div> <br/> press to see the highest Bidder </div>
        <button onClick = {this.getHighestBidder}> get Highest Bidder </button>
        {infobidder}
        <div> <br/> <br/> press to see the highest Bid </div>
        <button onClick = {this.getHighestBid}> get Highest Bid </button>
        {infobid}
        <div> <br/> <br/>type amount to bid (in finney) </div>
        <input type = "number" onChange={this.setBidValue} />
        <button onClick = {this.bid}> bid </button>
        <div> <br/> press to withdraw </div>
        <button onClick = {this.withdraw}> withdraw </button>
        <div> <br/> press to see contact balance </div>
        <button onClick = {this.getContractBalance}> contract balance </button>
        {infocontractBalance}
      </div>
    );
  }
}

export default App;
