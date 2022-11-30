import React, { useEffect, useState } from 'react';
import './App.css';
import { configureWeb3 } from './blockchain-helper'

function App () {
  const [txnArr, setTxnArr] = useState(null)
  const [address, setAddress] = useState("")
  
  // async function fetchEthBal(address) {
  //   try {
  //     const res = await fetch(`https://api-goerli.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.REACT_APP_ETHERSCAN_AK}`)
  //     const data = await res.json()
  //     console.log(data)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  async function fetchNormalTxs(address) {
    try {
      const res = await fetch(`https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort="desc"&apikey=${process.env.REACT_APP_ETHERSCAN_AK}`)
      const data = await res.json()
      setTxnArr(data.result)
      console.log("result", data.result)
      // map: blockHash, blockNumber, from, to, value, txn
      
    } catch (error) {
      console.error(error)
    }
  }

  function handleAddress(e) {
    e.preventDefault()
    setAddress(e.target.value)
  }

  useEffect(() => {
    window.web3 = configureWeb3(`https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_AK}`)
  }, [])
  return (
    <div>
      <h1>Goerli Explorer</h1>
      <input 
        value={address}
        id="address"
        name="address"
        type="text"
        placeholder="Search Address"
        onChange={handleAddress}
        required
      />
      <input
        type="submit"
        value="Get normal txs"
        disabled={address === ""}
        onClick={() => fetchNormalTxs(address)}
      />
      {/* <button onClick={() => fetchNormalTxs(address)}>Get normal txs</button> */}
      {txnArr && <table>
        <tr>
          <th>Txn Hash</th>
          <th>Block</th>
          <th>From</th>
          <th>To</th>
          <th>Value</th>
          <th>Txn Fee</th>
        </tr>
        {txnArr && txnArr.map(txn => {
        return (
          <tr key={txn.blockHash}>
            <td>{txn.blockHash}</td>
            <td>{txn.blockNumber}</td>
            <td>{txn.from}</td>
            <td>{txn.to}</td>
            <td>{txn.value}</td>
            <td>{txn.gasPrice}</td>
          </tr>
        )
      })}
      </table>}
    </div>
  )
}

export default App;
