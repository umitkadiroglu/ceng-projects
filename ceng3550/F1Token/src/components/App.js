import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from "web3";
import F1Token from "../abis/F1Token.json"

class App extends Component {
  
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadData()
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

  async loadData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = F1Token.networks[networkId]
    if(networkData) {
      const contract = web3.eth.Contract(F1Token.abi, networkData.address)
      this.setState({ contract })
      const balanceHex = await this.state.contract.methods.balanceOf(this.state.account).call()
      const balance = parseInt(balanceHex._hex, 16) + " F1T"
      this.setState({balance})

    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      contract: null,
      web3: null,
      buffer: null,
      account: null,
      balance: null
    }
  }

  onSubmit = (event) => {
    event.preventDefault()
    const toAddress = document.querySelector(".input-address").value
    const tokenValue = document.querySelector(".input-value").value
    this.state.contract.methods.transfer(toAddress,tokenValue).send({from: this.state.account}).on("confirmation",(r) =>{
    window.location.reload()
    })
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://localhost:3000/"
            rel="noopener noreferrer"
          >
            F1Token
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                href="http://localhost:3000/">
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1>Formula 1 tutkunlarına özel...</h1>
                <h2>Hesap adresiniz: {this.state.account}</h2>
                <h2>Bakiyeniz: {this.state.balance}</h2>
                <form onSubmit={this.onSubmit}>
                        <label>F1T gönderilecek hesap adresi: &nbsp;</label>
                        <input type="text" className="input-address" name="iaddress"/><br/>
                        <label>Gönderilecek F1T miktarı: &nbsp;</label>
                        <input type="text" className="input-value" name="ivalue"/><br/>
                        <input type="submit" value="Token Gönder"/>
                  </form>
              </div>

            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
