import React, { useState } from "react";
import { ERC20TokensTxn, Transactions } from "../component";
import { Box, Typography, Tab, Tabs, Container } from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";

function a11yProps(index) {
  return {
    id: `horizontal-tab-${index}`,
    "aria-controls": `horizontal-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, classes, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`horizontal-tabpanel-${index}`}
      aria-labelledby={`horizontal-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography sx={{ color: "black" }}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function Home({ data, setData }) {
  const [page, setPage] = useState(0);
  const theme = useTheme();
  const pages = [
    {
      id: 0,
      label: "Transactions",
      component: Transactions,
    },
    {
      id: 1,
      label: "ERC20 Tokens Txn",
      component: ERC20TokensTxn,
    },
  ];
  const handleChangeIndex = (index) => {
    setPage(index);
  };

  const handleChange = (event, index) => {
    setPage(index);
  };
  return (
    <Container maxWidth="xl">
      <Tabs
        value={page}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="inherit"
        variant="fullWidth"
        aria-label="full width tabs example"
      >
        {pages.map(({ id, label }) => (
          <Tab key={id} label={label} {...a11yProps(id)} />
        ))}
      </Tabs>

      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={page}
        onChangeIndex={handleChangeIndex}
        enableMouseEvents={false}
      >
        {pages.map(({ id, component: Component }) => (
          <TabPanel key={id} value={page} index={id} dir={theme.direction}>
            <Component data={data} setData={setData} />
          </TabPanel>
        ))}
      </SwipeableViews>
    </Container>
  );
}

export default Home;
