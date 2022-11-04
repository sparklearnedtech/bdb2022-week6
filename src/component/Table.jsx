import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

function Table({ columns, rows, loading, pageSize, setPageSize }) {
  return (
    <div style={{ height: 1000, width: "100%" }}>
      <DataGrid
        autoHeight
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rows={rows}
        columns={columns}
        rowsPerPageOptions={[5, 10, 20]}
        loading={loading}
      />
    </div>
  );
}

export default Table;
