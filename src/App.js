import { useEffect } from 'react';
import BlockChainExplorer from "./pages/BlockchainExplorer";
import './App.css';
import BlockChainHelper from './utils/BlockChainHelper';
import { contractAbi, gSrkContractAddress } from "./constants";

function App() {
  useEffect(() => {
    try {
      BlockChainHelper.initializeWeb3();
      if (window.web3.version) {
        BlockChainHelper.initializeToken(contractAbi, gSrkContractAddress);
      }
    } catch (error) {
      alert("Unable to initialize web3");
    }
  }, []);

  return (
    <div className="App">
      <BlockChainExplorer />
    </div>
  );
}

export default App;
