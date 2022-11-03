import React, { useState } from "react";
import "antd/dist/antd.css";
import { Input, Table, message, Typography, Button } from "antd";
import "./App.css";
import _ from "lodash";
import axios from "axios";
import Web3 from "web3";
const { Search } = Input;
function App() {
  const [initialValue, setInitialValue] = useState(null);
  const [dataTx, setDataTx] = useState(null);
  const [dataToken, setDataToken] = useState(null);
  const [tabChange, setTabChange] = useState(true);

  function onChangeInput(e) {
    setInitialValue(e.target.value);
  }

  function getTxnFee(x, y) {
    const initVal = x * y;
    return initVal;
  }

  function changeTab(num) {
    if (num === "1") {
      setTabChange(true);
    } else {
      setTabChange();
    }
  }
  async function fetchNormalTxs(address) {
    try {
      if (!_.isNil(address)) {
        const goerliObject1 = await axios.get(
          `https://api-goerli.etherscan.io/api?module=account&action=Txlist&address=${address}&startblock=0&endblock99999999&page=1&offset=10&sort="desc"&apikey=${process.env.REACT_APP_ETHERSCAN_AK}`
        );
        const goerliObject2 = await axios.get(
          `https://api-goerli.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock99999999&page=1&offset=10&sort="desc"&apikey=${process.env.REACT_APP_ETHERSCAN_AK}`
        );

        if (
          goerliObject1?.data?.status === "0" ||
          goerliObject2?.data?.status === "0"
        ) {
          setDataTx(null);
          setDataToken(null);
          message.warning(goerliObject1?.data?.result);
        } else {
          setDataTx(goerliObject1?.data?.result);
          setDataToken(goerliObject2?.data?.result);
        }
      } else {
        setDataTx(null);
        message.warning("Please input an address");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const columnsTxlist = [
    {
      key: "hash",
      title: "Txn Hash",
      dataIndex: "hash",
      width: 70,
      render: (hash) => (
        <a
          href={"https://goerli.etherscan.io/tx/" + hash}
          rel="noreferrer"
          target="_blank"
        >
          {hash.slice(0, 8) + "..."}
        </a>
      ),
    },
    {
      key: "blockNumber",
      title: "Block",
      dataIndex: "blockNumber",
      width: 70,
      render: (block) => (
        <a
          href={"https://goerli.etherscan.io/block/" + block}
          rel="noreferrer"
          target="_blank"
        >
          {block}
        </a>
      ),
    },
    {
      key: "from",
      title: "From",
      dataIndex: "from",
      width: 70,
      render: (from) => (
        <a
          href={"https://goerli.etherscan.io/address/" + from}
          rel="noreferrer"
          target="_blank"
        >
          {from.slice(0, 8) + "..."}
        </a>
      ),
    },
    {
      key: "to",
      title: "To",
      dataIndex: "to",
      width: 70,
      render: (to) => (
        <a
          href={"https://goerli.etherscan.io/address/" + to}
          rel="noreferrer"
          target="_blank"
        >
          {to.slice(0, 8) + "..."}
        </a>
      ),
    },
    {
      key: "value",
      title: "Value",
      dataIndex: "value",
      width: 70,
      render: (value) => <p>{Web3.utils.fromWei(value, "ether") + " ETH"}</p>,
    },
    {
      key: "Txn Fee",
      title: "Txn Fee",
      dataIndex: "gasPrice",
      width: 70,
      render: (text, record) => (
        <p>
          {Web3.utils.fromWei(
            JSON.stringify(getTxnFee(text, record.gasUsed)),
            "ether"
          )}
        </p>
      ),
    },
  ];

  const columnstokentx = [
    {
      key: "hash",
      title: "Txn Hash",
      dataIndex: "hash",
      width: 70,
      render: (hash) => (
        <a
          href={"https://goerli.etherscan.io/tx/" + hash}
          rel="noreferrer"
          target="_blank"
        >
          {hash.slice(0, 8) + "..."}
        </a>
      ),
    },

    {
      key: "from",
      title: "From",
      dataIndex: "from",
      width: 70,
      render: (from) => (
        <a
          href={"https://goerli.etherscan.io/address/" + from}
          rel="noreferrer"
          target="_blank"
        >
          {from.slice(0, 8) + "..."}
        </a>
      ),
    },
    {
      key: "to",
      title: "To",
      dataIndex: "to",
      width: 70,
      render: (to) => (
        <a
          href={"https://goerli.etherscan.io/address/" + to}
          rel="noreferrer"
          target="_blank"
        >
          {to.slice(0, 8) + "..."}
        </a>
      ),
    },
    {
      key: "value",
      title: "Value",
      dataIndex: "value",
      width: 70,
      render: (value, record) => (
        <p>{Web3.utils.fromWei(value, "ether") + " " + record.tokenSymbol}</p>
      ),
    },
    {
      key: "tokenName",
      title: "Token",
      dataIndex: "tokenName",
      width: 70,
      render: (text, record) => <p>{text + " (" + record.tokenSymbol + ")"}</p>,
    },
  ];
  return (
    <div className="App-header">
      <div className="title">
        <Typography style={{ color: "white" }} level={2}>
          Goerli Explorer
        </Typography>
      </div>
      <div className="Search-box">
        <Search
          placeholder="Search address"
          allowClear
          enterButton="Search"
          size="large"
          type="text"
          value={initialValue}
          onChange={(e) => onChangeInput(e)}
          onSearch={() => fetchNormalTxs(initialValue)}
        />
      </div>
      <div className="tab">
        <Button
          onClick={() => changeTab("1")}
          type={tabChange ? "primary" : ""}
        >
          Transactions
        </Button>
        <Button
          onClick={() => changeTab("2")}
          type={!tabChange ? "primary" : ""}
        >
          ERC20 Token Txns
        </Button>
      </div>
      <div className="Table-box">
        <Table
          className="tablebox"
          dataSource={tabChange ? dataTx : dataToken}
          columns={tabChange ? columnsTxlist : columnstokentx}
          scroll={{
            x: 300,
            y: 500,
          }}
        />
      </div>
    </div>
  );
}

export default App;
