import Table from "react-bootstrap/Table";
import Moment from "react-moment";
import moment from "moment";
import { useState, useEffect } from "react";
import BlockChainHelper from "../../utils/BlockChainHelper";
import { convertToBigNum } from "../../utils";
import { gSrkContractAddress } from "../../constants";
import "./style.css";

const TX_HASH_URL = `${process.env.REACT_APP_ETHERSCAN_URL}/tx`;
const ADDRESS_URL = `${process.env.REACT_APP_ETHERSCAN_URL}/address`;
const BLOCK_URL = `${process.env.REACT_APP_ETHERSCAN_URL}/block`;
const TOKEN_URL = `${process.env.REACT_APP_ETHERSCAN_URL}/token/${gSrkContractAddress}`;

const convertToUnixTimeStamp = (timeStamp) => {
  return moment.unix(timeStamp).format();
};

const displayTxRow = (data, txType, address) => {
  if (data.length > 0) {
    return data.map((item) => {
      if (txType === "erc20") {
        return (
          <tr key={item.hash}>
            <td className="content">
              <a
                href={`${TX_HASH_URL}/${item.hash}`}
                target="_blank"
                rel="noreferrer"
              >
                {item.hash}
              </a>
            </td>
            <td className="content">
              <Moment fromNow>{convertToUnixTimeStamp(item.timeStamp)}</Moment>
            </td>
            <td className="content">
              <a
                href={`${ADDRESS_URL}/${item.from}`}
                target="_blank"
                rel="noreferrer"
              >
                {item.from}
              </a>
            </td>
            <td className="content">{item.to}</td>
            <td className="content">{item.value}</td>
            <td className="content">
              <a
                href={`${TOKEN_URL}?a=${address}`}
                target="_blank"
                rel="noreferrer"
              >
                {item.tokenName}
              </a>
            </td>
          </tr>
        );
      } else if (txType === "internal") {
        return (
          <tr key={item.hash}>
            <td className="content">
              <a
                href={`${TX_HASH_URL}/${item.hash}`}
                target="_blank"
                rel="noreferrer"
              >
                {item.hash}
              </a>
            </td>
            <td className="content">
              <a
                href={`${BLOCK_URL}/${item.blockNumber}`}
                target="_blank"
                rel="noreferrer"
              >
                {item.blockNumber}
              </a>
            </td>
            <td className="content">
              <Moment fromNow>{convertToUnixTimeStamp(item.timeStamp)}</Moment>
            </td>
            <td className="content">
              <a
                href={`${ADDRESS_URL}/${item.from}`}
                target="_blank"
                rel="noreferrer"
              >
                {item.from}
              </a>
            </td>
            <td className="content">{item.to}</td>
            <td className="content">{item.value}</td>
          </tr>
        );
      } else {
        return (
          <tr key={item.hash}>
            <td className="content">
              <a
                href={`${TX_HASH_URL}/${item.hash}`}
                target="_blank"
                rel="noreferrer"
              >
                {item.hash}
              </a>
            </td>
            <td className="content">
              <a
                href={`${BLOCK_URL}/${item.blockNumber}`}
                target="_blank"
                rel="noreferrer"
              >
                {item.blockNumber}
              </a>
            </td>
            <td className="content">
              <Moment fromNow>{convertToUnixTimeStamp(item.timeStamp)}</Moment>
            </td>
            <td className="content">
              <a
                href={`${ADDRESS_URL}/${item.from}`}
                target="_blank"
                rel="noreferrer"
              >
                {item.from}
              </a>
            </td>
            <td className="content">{item.to}</td>
            <td className="content">{item.value}</td>
            <td className="content">{item.txnFee}</td>
          </tr>
        );
      }
    });
  } else {
    const colSpan = txType === "normal" ? 7 : 6;
    return (
      <tr>
        <td colSpan={colSpan} className="no-entries">
          There are no matching entries
        </td>
      </tr>
    );
  }
};

const displayTxHeader = (type) => {
  if (type === "erc20") {
    return (
      <tr>
        <th>Txn Hash</th>
        <th>Age</th>
        <th>From</th>
        <th>To</th>
        <th>Value</th>
        <th>Token</th>
      </tr>
    );
  } else if (type === "internal") {
    return (
      <tr>
        <th>Parent Txn Hash</th>
        <th>Block</th>
        <th>Age</th>
        <th>From</th>
        <th>To</th>
        <th>Value</th>
      </tr>
    );
  } else {
    return (
      <tr>
        <th>Txn Hash</th>
        <th>Block</th>
        <th>Age</th>
        <th>From</th>
        <th>To</th>
        <th>Value</th>
        <th>Txn Fee</th>
      </tr>
    );
  }
};

function ResultsTable({ txsData, txType = "normal", address }) {
  const [formattedData, setFormattedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await Promise.all(
        txsData.map(async (item) => {
          let txnFee = null;
          if (txType === "normal") {
            const gasPriceBN = convertToBigNum(item.gasPrice);
            const txnFeeBN = gasPriceBN.mul(item.gasUsed);
            txnFee = await BlockChainHelper.convertValue(
              txnFeeBN.toHexString()
            );
          }

          return await {
            ...item,
            value: await BlockChainHelper.convertValue(item.value),
            ...(txnFee && { txnFee }),
          };
        })
      );
      setFormattedData(data);
    };
    fetchData();
    return () => {
      setFormattedData([]);
    };
  }, [txsData, txType, address]);
  return (
    <Table striped bordered hover>
      <thead>{displayTxHeader(txType)}</thead>
      <tbody>{displayTxRow(formattedData, txType, address)}</tbody>
    </Table>
  );
}

export default ResultsTable;
