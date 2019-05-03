import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import ElectionContract from "./contracts/Election.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      storageValue: 0,
      web3: null,
      accounts: null,
      contract: null,
      candidates: [],
      candidateCount: 0,
      hasVoted: false
    };
    this.voteForCandidate = this.voteForCandidate.bind(this)
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ElectionContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ElectionContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    //check if voter has already voted
    const hasVoted = await contract.methods.voters(accounts[0]).call();

    // Get all candidate count
    const candidateCount = await contract.methods.candidatesCount().call();

    // Update state with the result.
    this.setState({ candidateCount, hasVoted });

    let i = 0;
    while (i < candidateCount) {
      const candidate = await contract.methods.candidates(i).call();
      this.setState({
        candidates: [...this.state.candidates, candidate]
      })
      i++;
    }
  };

  voteForCandidate = async (candidateId) => {
    const { accounts, contract, candidateCount } = this.state;

    // cast vote
    await contract.methods.vote(candidateId).send({ from: accounts[0] });
    console.log('vote casted')

    // ensure current account has voted
    const hasVoted = await contract.methods.voters(accounts[0]).call();
    this.setState({hasVoted})

    // update candidate count
    // const candidate = await contract.methods.candidates(candidateId).call();
    let i = 0;
    while (i < candidateCount) {
      const candidate = await contract.methods.candidates(i).call();
      this.setState({
        candidates: [...this.state.candidates, candidate]
      })
      i++;
    }

  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    const voteStatusMessage = this.state.hasVoted ? "Thanks for your vote!" : "Place your vote for account";

    return (
      <div className="App">
        <h1>Election Dapp</h1>
        <hr/>
        {this.state.candidates.map((candidate) =>
          <p><b>{candidate.name}</b> has <b>{candidate.voteCount}</b> votes
            { this.state.hasVoted ? <div/> : <button onClick={() => {this.voteForCandidate(candidate.id)}}>Cast vote</button>  }
          </p>
        )}
        <br/>
        <p>
          {voteStatusMessage}
          <br/>
          {this.state.accounts[0]}
        </p>
      </div>
    );
  }
}

export default App;
