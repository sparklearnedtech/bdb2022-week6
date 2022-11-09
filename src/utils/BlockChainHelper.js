import Web3 from "web3";
import axios from "axios";
import { gSrkContractAddress } from "../constants";

const BlockChainHelper = {
  configureWeb3: (provider = null) => {
    if (!window.ethereum &&  !provider) {
      throw new Error("No Ethereum provider detected");
    }
    return new Web3(provider ? new Web3.providers.HttpProvider(provider) : window.ethereum);
  },
  initializeWeb3: async () => {
    const infuraURL = `${process.env.REACT_APP_INFURA_GOERLI_API_URL}/${process.env.REACT_APP_INFURA_API_KEY}`;
    window.web3 = await BlockChainHelper.configureWeb3(infuraURL);
  },
  getApiResults: async url => {
    try {
      const response = await axios.get(url);
      if (response && response.data && response.data.result) {
        return response.data.result;
      }
    } catch (error) {
      console.error("Error fetching response", error);
    }
  },
  fetchEthBal: async address => {
    const url = `${process.env.REACT_APP_ETHERSCAN_API_URL}?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;
    const result = await BlockChainHelper.getApiResults(url);
    const balance = BlockChainHelper.convertValue(result);
    return balance;
  },
  fetchNormalTxs: async (address, page = 1) => {
    const url = `${process.env.REACT_APP_ETHERSCAN_API_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=20&sort=desc&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;
    const result = await BlockChainHelper.getApiResults(url);

    if (result && result.length > 0) {
      return result;
    } else {
      return [];
    }
  },
  fetchErc20Txs: async (address, page = 1) => {
    const url = `${process.env.REACT_APP_ETHERSCAN_API_URL}?module=account&action=tokentx&contractaddress=${gSrkContractAddress}&address=${address}&page=${page}&offset=20&startblock=0endblock=99999999&sort=desc&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;
    const result = await BlockChainHelper.getApiResults(url);

    if (result && result.length > 0) {
      return result;
    } else {
      return [];
    }
  },
  fetchInternalTxs: async (address, page = 1) => {
    const url = `${process.env.REACT_APP_ETHERSCAN_API_URL}?module=account&action=txlistinternal&address=${address}&startblock=0&endblock=9999999&page=${page}&offset=10&sort=desc&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;
    const result = await BlockChainHelper.getApiResults(url);

    if (result && result.length > 0) {
      return result;
    } else {
      return [];
    }
  },
  initializeToken: async (abi, address) => {
    window.token = await new window.web3.eth.Contract(abi, address);
  },
  getTotalSupply: async () => {
    let totalSupply = 0;
    if (window.token && window.token.methods) {
      await window.token.methods.totalSupply().call((error, result) => {
        if (error) {
          console.error("Error getting total supply", error);
        } else {
          totalSupply = BlockChainHelper.convertValue(result);
        }
      });
    } else {
      console.error("Window.token is empty");
    }
    return totalSupply;
  },
  fetchTokenBal: async address => {
    let balance = 0;
    if (window.token && window.token.methods) {
      await window.token.methods.balanceOf(address).call((error, result) => {
        if (error) {
          console.error("Error getting token balance", error);
        } else {
          balance = BlockChainHelper.convertValue(result);
        }
      });
    } else {
      console.error("Window.token is empty");
    }
    return balance;
  },
  convertValue: async (value, unit = "ether") => {
    if (!window.web3.utils) {
      console.error("Unable to convert");
      return;
    }
    return await window.web3.utils.fromWei(value, unit);
  },
  isAddress: async address => {
    return await window.web3.utils.isAddress(address);
  }
};

export default BlockChainHelper;


