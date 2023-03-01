import cassandra from 'cassandra-driver';
import * as dotenv from "dotenv";
import path from 'path';

dotenv.config({path: path.join(__dirname, '../', '../', '/.env')});

const {TOKEN} = process.env;

const client = new cassandra.Client({
  cloud: {secureConnectBundle: path.join(__dirname, '../', '../', '/secure-connect-ethereum.zip')},
  credentials: {username: 'token', password: TOKEN}
});

const getOneTransaction = async () => {
  const {info, columns, rows} = await client.execute(`SELECT * FROM ethereum.transactions LIMIT 1;`);
  console.log(rows);
};

const getOneDashboardAnalyticsRow = async () => {
  const {info, columns, rows} = await client.execute(`SELECT * FROM ethereum.dashboard_analytics LIMIT 1;`);
  console.log('---------------------------\n\n')
  console.log(`INSERT into dashboard_analytics (${Object.keys(rows[0]).join(", ")}) VALUES (${Object.values(rows[0]).map(item => {

    return `'${item}'`;
  }).join(", ")});`);
  console.log('\n\n---------------------------')
};

const getTransactionsByWalletAddress = async (fromAddress:string) => {
  // Note: We're still in the process of backfilling data for this table, will be done soon
  const {info, columns, rows} = await client.execute(`SELECT * FROM ethereum.transactions_by_address WHERE from_address =?;`, [fromAddress],);
  console.log(rows);
};


getOneDashboardAnalyticsRow();
