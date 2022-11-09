import { useState } from "react";
import _ from "lodash";
import { Container, Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import BlockChainHelper from "../../utils/BlockChainHelper";
import SearchBar from "../../components/SearchBar";
import ResultsTable from "../../components/Table";
import Table from "react-bootstrap/Table";
import "./style.css";

function BlockChainExplorer() {
  const [isInitial, setIsInitial] = useState(true);
  const [address, setAddress] = useState("");
  const [normalTxs, setNormalTxs] = useState([]);
  const [internalTxs, setInternalTxs] = useState([]);
  const [erc20Txs, setErc20Txs] = useState([]);
  const [tableType, setTableType] = useState("normal");
  const [isSearching, setIsSearching] = useState(false);
  const [ethBal, setEthBal] = useState(0);

  const handleInputSearch = (e) => {
    setAddress(e.target.value);
  };

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") {
      handleOnSearchClicked();
    }
  };

  const resetTxsData = () => {
    setNormalTxs([]);
    setInternalTxs([]);
    setErc20Txs([]);
    setEthBal(0);
  };

  const handleOnSearchClicked = async () => {
    resetTxsData();
    const isValid = await BlockChainHelper.isAddress(address);
    setIsSearching(true);
    if (!isValid) {
      setIsSearching(false);
      alert("Please enter a valid address");
      return;
    }
    const bal = await BlockChainHelper.fetchEthBal(address);
    setEthBal(bal);

    const normalTxsData = await BlockChainHelper.fetchNormalTxs(address);
    if (!_.isEmpty(normalTxsData)) {
      setNormalTxs(normalTxsData);
      setTableType("normal");
    }

    const erc20TxsData = await BlockChainHelper.fetchErc20Txs(address);
    if (!_.isEmpty(erc20TxsData)) {
      setErc20Txs(erc20TxsData);
    }

    const internalTxsData = await BlockChainHelper.fetchInternalTxs(address);
    if (!_.isEmpty(internalTxsData)) {
      setInternalTxs(internalTxsData);
    }
    setIsInitial(false);
    setIsSearching(false);
  };

  const displayResultsTable = () => {
    if (!isInitial && !isSearching) {
      let data = !_.isEmpty(normalTxs) ? normalTxs : [];
      const tabs = [{ eventKey: "normal", title: "Transactions" }];

      if (tableType === "internal" && !_.isEmpty(internalTxs)) {
        data = internalTxs;
      } else if (tableType === "erc20" && !_.isEmpty(erc20Txs)) {
        data = erc20Txs;
      }

      if (!_.isEmpty(erc20Txs)) {
        tabs.push({ eventKey: "erc20", title: "Erc20 Token txns" });
      }
      if (!_.isEmpty(internalTxs)) {
        tabs.push({ eventKey: "internal", title: "Internal txns" });
      }

      return (
        <>
          <Row>
            <Col className="mx-0 my-2 mb-5 px-0 d-flex align-content-start">
              {balanceDisplaySection()}
            </Col>
          </Row>
          <Row>
            <Col className="mx-0 px-0">
              <Tabs
                id="controlled-tab-example"
                activeKey={tableType}
                onSelect={(k) => setTableType(k)}
                className="mb-0"
              >
                {tabs.map((item) => {
                  return (
                    <Tab
                      eventKey={item.eventKey}
                      title={item.title}
                      key={item.eventKey}
                    >
                      <ResultsTable
                        txsData={data}
                        txType={tableType}
                        address={address}
                      />
                    </Tab>
                  );
                })}
              </Tabs>
            </Col>
          </Row>
          {displayTableFooterRow()}
        </>
      );
    }
    return null;
  };

  const displayLoader = () => {
    return (
      <Spinner animation="border" variant="secondary" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  };

  const displayTableFooterRow = () => {
    return (
      <Row className="table-footer-row">
        <Col>&nbsp;</Col>
      </Row>
    );
  };

  const balanceDisplaySection = () => {
    return (
      <Card className="address-details">
        <Card.Title className="address-title">
          Address: <span className="text-muted">{address}</span>
        </Card.Title>
        <Card.Body className="address-body">
          <Table borderless size="sm">
            <tbody>
              <tr>
                <td className="balance-left">ETH Balance:</td>
                <td className="balance-right">{ethBal}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Container className="blockchain-explorer-container">
      <Row>
        <Col className="mx-0 px-0">
          <h2>Custom Goerli Explorer</h2>
        </Col>
      </Row>
      <Row>
        <Col className="mx-0 px-0">
          <SearchBar
            address={address}
            handleInputSearch={handleInputSearch}
            handleOnSearchClicked={handleOnSearchClicked}
            handleOnKeyDown={handleOnKeyDown}
            placeholder="Search by Address"
            buttonText="Search"
          />
        </Col>
      </Row>
      {isSearching && displayLoader()}
      {displayResultsTable()}
    </Container>
  );
}

export default BlockChainExplorer;
