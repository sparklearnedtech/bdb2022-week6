import { configureWeb3 } from "../blockchain-helper";
import axios from "axios";

const Helper = {

  initializeWeb3: async () => {
    window.web3 = await configureWeb3(`${process.env.REACT_APP_INFURA_GOERLI_API_URL}/${process.env.REACT_APP_INFURA_AK}`);
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
  

  convertValue: async (value, unit = "ether") => {
    if (!window.web3.utils) {
      console.error("Unable to convert");
      return;
    }
    return await window.web3.utils.fromWei(value, unit);
  },

};

export default Helper;


