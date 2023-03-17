import cassandra from 'cassandra-driver';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.join(__dirname, '../', '../', '/.env')});

const {ASTRA_DB_TOKEN, ASTRA_DB_CREDENTIALS_ZIP_FILE_PATH} = process.env;

const client = new cassandra.Client({
  cloud: {secureConnectBundle: path.join(__dirname, '../', '../', ASTRA_DB_CREDENTIALS_ZIP_FILE_PATH)},
  credentials: {username: 'token', password: ASTRA_DB_TOKEN}
});

const getOneTransaction = async () => {
  const {info, columns, rows} = await client.execute(`SELECT * FROM ethereum.transactions LIMIT 1;`);
  console.log(rows);
};

const getTransactionsByWalletAddress = async (fromAddress: string) => {
  const {
    info,
    columns,
    rows
  } = await client.execute(`SELECT * FROM ethereum.transactions_by_address WHERE from_address =?;`, [fromAddress],);
  console.log(rows);
};

getOneTransaction();
