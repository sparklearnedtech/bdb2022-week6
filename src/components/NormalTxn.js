import { Table } from 'react-bootstrap';


const NormalTxn = props => {
    const {normalTxn} = props;
    return(
      <div>
        <Table>
          <thead>
            <tr>
                <th>Txn Hash</th>
                <th>Block</th>
                <th>From</th>
                <th>To</th>
                <th>Value</th>
                <th>Txn Fee</th>
            </tr>
          </thead>
          <tbody>
            {normalTxn.map((data, index) => (
              <tr key={index}>
                <td><a href={`https://etherscan.io/tx/${data.hash}`} target="_blank" rel="noreferrer noopener">{data.hash}</a></td>
                <td><a href={`https://etherscan.io/block/${data.blockNumber}`} target="_blank" rel="noreferrer noopener">{data.blockNumber}</a></td>
                <td><a href={`https://etherscan.io/address/${data.from}`} target="_blank" rel="noreferrer noopener">{data.from}</a></td>
                <td><a href={`https://etherscan.io/address/${data.to}`} target="_blank" rel="noreferrer noopener">{data.to}</a></td>
                <td>{window.web3.utils.fromWei(data.value, "ether")} ETH</td>
                <td>{(data.gasPrice * data.gasUsed)/10 ** 18}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )
}
export default NormalTxn;