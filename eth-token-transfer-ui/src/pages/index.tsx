import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import dayjs, {Dayjs} from 'dayjs';
import {
  TextField,
  createTheme,
  ThemeProvider,
  InputLabel,
  MenuItem,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  TableRow,
  Select,
  Unstable_Grid2 as Grid,
  Button, Paper, Table,
} from '@mui/material';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';

import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {useState} from 'react';

const theme = createTheme(
  {
    palette: {
      mode: 'dark',
    },
  },
);

export default function Home() {
  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs('2023-01-10T21:11:54'),
  );

  const [endDate, setEndDate] = useState<Dayjs | null>(
    dayjs(),
  );

  const [results, setResults] = useState([]);
  const [resultsHeading, setResultsHeading] = useState("");

  const [walletAddress, setWalletAddress] = useState<string | null>("0x31c4ac31568689e597b191b1e7d2cb92eb2a00b1");
  const [tokenAddress, setTokenAddress] = useState<string | null>("0xdac17f958d2ee523a2206206994597c13d831ec7");

  const runQuery = async () => {
    setResults([]);
    setResultsHeading("");
    const response = await axios.post('/api/block', {
      startDate: startDate?.format('YYYY-MM-DD'),
      endDate: endDate?.format('YYYY-MM-DD'),
      walletAddress,
      tokenAddress,
    });
    setResultsHeading(`Results for blocks ${response?.data?.minBlock} to ${response?.data?.maxBlock}`);
    setResults(response?.data?.results);
  };

  return (
    <>
      <Head>
        <title>Token Transfers Demo</title>
        <meta name="description" content="Generated by create next app"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <main className={styles.main}>
            <Grid container spacing={2}>
              <Grid xs={12}>
                Token Transfer by Date Demo
              </Grid>
              <Grid xs={12}>
                <TextField label={"Wallet Address"} value={walletAddress}
                           onChange={(e) => setWalletAddress(e.target.value)}/>
              </Grid>
              <Grid xs={12}>
                <DesktopDatePicker
                  label="Start Date"
                  inputFormat="MM/DD/YYYY"
                  value={startDate}
                  onChange={(value: Dayjs | null) => setStartDate(value)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid xs={12}>
                <DesktopDatePicker
                  label="End Date"
                  inputFormat="MM/DD/YYYY"
                  value={endDate}
                  maxDate={dayjs()}
                  onChange={(value: Dayjs | null) => setEndDate(value)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid xs={12}>
                <InputLabel id="demo-simple-select-label">Token</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={tokenAddress}
                  label="Token Address"
                  onChange={(e) => {
                    setTokenAddress(e.target.value)
                  }}
                >
                  <MenuItem value={'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'}>USDC</MenuItem>
                  <MenuItem value={'0xdac17f958d2ee523a2206206994597c13d831ec7'}>Tether USD</MenuItem>
                  <MenuItem value={'0xB8c77482e45F1F44dE1745F52C74426C631bDD52'}>BNB</MenuItem>
                  <MenuItem value={'0x75231f58b43240c9718dd58b4967c5114342a86c'}>OKB</MenuItem>
                  <MenuItem value={'0x2b591e99afe9f32eaa6214f7b7629768c40eeb39'}>Hex</MenuItem>
                  <MenuItem value={'0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0'}>Matic Token</MenuItem>
                  <MenuItem value={'0x4fabb145d64652a948d72533023f6e7a623c7c53'}>Binance USD</MenuItem>
                </Select>
              </Grid>
              <Grid xs={12}>
                <Button onClick={runQuery} variant="outlined">Run Query</Button>
              </Grid>
            </Grid>
            {resultsHeading}
            {resultsHeading !== "" && results.length === 0 && <span>No Results</span>}
            {results.length > 0 && (<Grid mt={3} xs={12}>
              <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Transaction Hash</TableCell>
                      <TableCell align="right">From Address</TableCell>
                      <TableCell align="right">To Address</TableCell>
                      <TableCell align="right">Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results?.map((row: any) => (
                      <TableRow
                        key={row?.block_number}
                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                      >
                        <TableCell component="th" scope="row">{row?.transaction_hash}</TableCell>
                        <TableCell align="right">{row?.from_address}</TableCell>
                        <TableCell align="right">{row?.to_address}</TableCell>
                        <TableCell align="right">{row?.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>)}
          </main>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  )
}
