import React, { useState, useEffect } from "react";
import {
  Box,
  InputBase,
  IconButton,
  Container,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import Home from "../pages/Home";
import "./App.css";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import _ from "lodash";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const App = () => {
  const [data, setData] = useState({
    loading: false,
    transactions: [],
    erc20: [],
    pageSize: 5,
    network: {},
  });
  const [address, setAddress] = useState("");

  useEffect(() => {
    console.log(data);
  }, [data]);

  const networks = [
    {
      id: 1,
      title: "Mainnet",
      network: "https://api.etherscan.io/",
    },
    {
      id: 2,
      title: "Goerli",
      network: "https://api-goerli.etherscan.io/",
    },
    {
      id: 3,
      title: "Ropsten",
      network: "https://api-ropsten.etherscan.io/",
    },
  ];

  const handleChange = (event) => {
    const { value } = event.target;
    const filteredNetwork = networks.filter((network) => network.id === value);
    setData({ ...data, network: filteredNetwork[0] });

    console.log(filteredNetwork);
  };

  const handleOnChangeAddress = (e) => {
    setAddress(e.target.value);
  };

  const handleOnClickSearch = async () => {
    try {
      if (!_.isNil(address) && !_.isEqual(data.network, "")) {
        if (!_.isNil(data.network) && !_.isEqual(data.network, {})) {
          setData({ ...data, loading: true });
          const [transactions, erc20] = await Promise.all([
            axios.get(
              `${data.network.network}api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort="desc&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`
            ),
            axios.get(
              `${data.network.network}api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort="desc&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`
            ),
          ]);
          if (
            transactions?.data?.status === "0" ||
            erc20?.data.status === "0"
          ) {
            setData({
              ...data,
              loading: false,
              transactions: [],
              erc20: [],
            });
            alert(
              "Please input a correct address or double check your network."
            );
          } else {
            setData({
              ...data,
              loading: false,
              transactions: transactions,
              erc20: erc20,
            });
          }
        } else {
          alert("Please select network first");
          setData({ ...data, loading: false });
        }
      } else {
        alert("Please input your address");
        setData({ ...data, loading: false });
      }
    } catch (error) {
      alert(error);
    }
  };
  return (
    <Box
      className="App"
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Container
        maxWidth="md"
        sx={{ display: "flex", gap: "20px", marginTop: "100px" }}
      >
        <FormControl sx={{ width: 300 }}>
          <InputLabel id="demo-simple-select-label">Network</InputLabel>
          <Select
            label="Network"
            value={data.network.id}
            onChange={handleChange}
          >
            {networks.map(({ id, title }) => (
              <MenuItem key={id} value={id}>
                {title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Type your address here"
          variant="outlined"
          value={address}
          onChange={(e) => handleOnChangeAddress(e)}
          sx={{ flexGrow: 1 }}
        />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => handleOnClickSearch()}>
            <FiSearch />
          </IconButton>
        </Box>
      </Container>
      <Home data={data} setData={setData} />
    </Box>
  );
};

export default App;
