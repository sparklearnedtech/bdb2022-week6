import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Table from "./Table";
import { Box } from "@mui/material";
import _ from "lodash";

function Transactions({ data, setData }) {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (!_.isNil(data.transactions)) {
      if (data.transactions?.data?.result?.length > 0) {
        let filteredData = data.transactions?.data?.result?.map((res) => {
          return {
            id: res?.hash,
            blockNumber: res?.blockNumber,
            from: res?.from,
            to: res?.to,
            value: Web3.utils.fromWei(res?.value, "ether") + " ETH",
            gasPrice: Web3.utils.fromWei(res?.gasPrice, "ether") + " ETH",
          };
        });

        setRows(filteredData);
      }
    } else {
      alert("Something went wrong");
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
    { field: "blockNumber", headerName: "Block", width: 130 },
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
    { field: "gasPrice", headerName: "Txn Fee", width: 160 },
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

export default Transactions;
