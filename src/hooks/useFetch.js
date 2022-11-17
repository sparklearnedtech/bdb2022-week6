import { srkAddress } from "../constants";
import Helper from "../utils/Helper";

const useFetch = {

  isAddress: async address => {
    if (window.web3.utils.isAddress(address) === false) {
      return await window.web3.utils.isAddress(address);
    } else {
      console.log("Invalid wallet address")
    };
    
  },

  convertFromWei: async (value, unit = "ether") => {
    if (window.web3.utils === '') {
      console.error("");
      return;
    }
    return await window.web3.utils.fromWei(value, unit);
  },

  initToken: async (abi, address) => {
    window.token = await new window.web3.eth.Contract(abi, address);
    // console.log(window.token);
  },

  fetchEthBal: async address => {
    fetch(`${process.env.REACT_APP_ETHERSCAN_API_URL}?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.REACT_APP_ETHERSCAN_AK}`);
    const res = await Helper.getApiResults(`${process.env.REACT_APP_ETHERSCAN_API_URL}?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.REACT_APP_ETHERSCAN_AK}`);
    const balance = Helper.convertFromWei(res);
    // console.log(balance)
    // Eth bal
    return balance;
  },

  fetchNormalTxn: async (address) => {
    fetch(`https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort="desc"&apikey=${process.env.REACT_APP_ETHERSCAN_AK}`)
    .then(res=>res.json())
      const result = await Helper.getApiResults(`https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort="desc"&apikey=${process.env.REACT_APP_ETHERSCAN_AK}`);
      if (result && result.length > 0) {
        return result;
      } else {
        return [];
      }
  },

  fetchErc20Txs: async (address, page = 1) => {
    fetch(`https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${srkAddress}&address=${address}&page=${page}&offset=10&startblock=0endblock=99999999&sort="desc"&apikey=${process.env.REACT_APP_ETHERSCAN_AK}`);
    const res = await Helper.getApiResults(`https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${srkAddress}&address=${address}&page=${page}&offset=10&startblock=0endblock=99999999&sort="desc"&apikey=${process.env.REACT_APP_ETHERSCAN_AK}`);

    if (res.length !== 0 && res) {
      return res;
    } else {
      return [];
    }
  },

  getTotalSupply: async () => {
    let totalSupply = 0;
    if (window.token && window.token.methods) {
      await window.token.methods.totalSupply().call((error, result) => {
        if (error) {
          console.error(error);
          // console.log(window.web3.utils.fromWei(result));
        } else {
          totalSupply = Helper.convertFromWei(result);
        }
      });
    } else {
      console.error("Supply error");
    }
    return totalSupply;
  },

  fetchTokenBal: async address => {
    // clear
    let balance = 0;

    if (window.token && window.token.methods) {
      await window.token.methods.balanceOf(address).call((error, result) => {
        if (error) {
          console.error("Window token error", error);
        } else {
          // console.log(window.web3.utils.fromWei(result));
          balance = Helper.convertFromWei(result);
        }
      });
    } else {
      console.error("Window.token is empty");
    }
    return balance;
  },
  
};

export default useFetch;