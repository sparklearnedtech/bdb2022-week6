import { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Nav, Card, Spinner } from 'react-bootstrap';
import { configureWeb3 } from './blockchain-helper';
import useFetch from './hooks/useFetch';
import Helper from './utils/Helper';
import SearchComponent from './components/SearchComponent';
import NormalTxn from './components/NormalTxn';
import Erc20TokenTxn from './components/Erc20TokenTxn';

function App() {
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState("");
  const [normalTxn, setNormalTxn] = useState([]);
  const [transactionTab, setTransactionTab] = useState('');
  const [activeTab, setActiveTab] = useState('#tx');
  const [ERC20Txn, setERC20Txn] = useState([]);
  // const [userBalance, setUserBalance] = useState(0);
  const globalReset = () => {
    setNormalTxn([]);
    setERC20Txn([]);
  };

  const inputHandler = (e) => {
    setAddress(e.target.value);
  };


  useEffect(() => {
    try {
      configureWeb3();
    } catch (error) {
      alert("Web3 configuration error, please reload app.");
    }
  }, []);

  useEffect(() => {
    // 1.2 sec timeout pl
    const res_time = setTimeout(() => {
      if (activeTab === '#normaltx') {
        const tx = (<NormalTxn normalTxn={normalTxn}/>);
        setTransactionTab(tx);
      } else if (activeTab === '#erc20tx') {
        const erc20 = (<Erc20TokenTxn ERC20Txn={ERC20Txn}/>);
        setTransactionTab(erc20);
      }
    }, 1200);

    return() => clearTimeout(res_time);
  });

  const searchHandler = async () => {
    setLoading(true);
    const hasAddress = await Helper.isAddress(address);
    globalReset();
    if (!hasAddress) {
      setLoading(false);
      alert("Please enter a valid address");
      return;
    }
    const bal = await useFetch.fetchEthBal(address);
    // setUserBalance(bal);

    const normalTxnData = await useFetch.fetchNormalTxn(address);
    setNormalTxn(normalTxnData);

    const erc20TxsData = await useFetch.fetchErc20Txs(address);
    setERC20Txn(erc20TxsData);
  };

  // Spinner tx
  const loader = () => {
    return (
      <div style={{ textAlign: 'center', marginBottom: '14px' }}>
        <Spinner 
          animation="grow" 
          variant="primary" 
        />
      </div>
    );
  };

  return (
    <Container>
      <Row style={{ marginTop: '30px', marginBottom: '20px' }}>
        <Col style={{ marginBottom: '10px' }}>
          <h1>Simple Goerli Explorer</h1>
          </Col>
        <Form className="form d-flex">
          <SearchComponent
            address={address}
            inputHandler={inputHandler}
            searchHandler={searchHandler}
            placeholder="Search by Address"
            buttonText="Search"
          />
          <Button 
            className="button" 
            onClick={searchHandler}
            disabled={address === ''}
          >
            Search
          </Button>
        </Form>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Nav className="nav" variant="tabs" defaultActiveKey="#tx" onSelect={(selectedKey) => setActiveTab(selectedKey)} >
                <Nav.Item>
                  <Nav.Link className="linkText" href="#tx">Transactions</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className="linkText" href="#erc20">ERC20 Token Txn</Nav.Link>
                </Nav.Item>
                {/* <Nav.Item>
                  <Nav.Link className="linkText" href="#bal">Account Balance</Nav.Link>
                </Nav.Item> */}
              </Nav>
            </Card.Header>
            <Card.Body>
              {transactionTab}
            </Card.Body>
                {/* <text>Balance: {ethBal}</text> */}
                {loading && loader()}
            </Card>
        </Col>
      </Row>
      
    </Container>
  );
}

export default App;
