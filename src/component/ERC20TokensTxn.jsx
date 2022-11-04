import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Table from "./Table";
import Web3 from "web3";

function ERC20TokensTxn({ data, setData }) {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (data.erc20?.data?.result.length > 0) {
      let filteredData = data.erc20?.data?.result.map((res) => {
        return {
          id: res.hash,
          from: res.from,
          to: res.to,
          value: Web3.utils.fromWei(res.value, "ether") + " ETH",
          tokenName: res.tokenName + " (" + res.tokenSymbol + ")",
        };
      });

      setRows(filteredData);
    }
  }, [data]);

  const columns = [
    {
      field: "id",
      headerName: "Txn Hash",
      width: 420,
      renderCell: (params) => (
        <Box
          component="a"
          href={`${data.network.network}tx/${params.value}`}
          rel="noreferrer"
          target="_blank"
        >
          {params.value.slice(0, 48) + "..."}
        </Box>
      ),
    },
    {
      field: "from",
      headerName: "From",
      width: 380,
      renderCell: (params) => (
        <Box
          component="a"
          href={`${data.network.network}address/${params.value}`}
          rel="noreferrer"
          target="_blank"
        >
          {params.value.slice(0, 48) + "..."}
        </Box>
      ),
    },
    {
      field: "to",
      headerName: "To",
      width: 380,
      renderCell: (params) => (
        <Box
          component="a"
          href={`${data.network.network}address/${params.value}`}
          rel="noreferrer"
          target="_blank"
        >
          {params.value.slice(0, 48) + "..."}
        </Box>
      ),
    },
    { field: "value", headerName: "Value", width: 160 },
    { field: "tokenName", headerName: "Token", width: 130 },
  ];

  return (
    <Table
      columns={columns}
      rows={rows}
      loading={data.loading}
      pageSize={data.pageSize}
      setPageSize={(newPageSize) => setData({ ...data, pageSize: newPageSize })}
    />
  );
}

export default ERC20TokensTxn;
