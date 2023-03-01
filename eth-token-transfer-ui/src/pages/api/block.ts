import type {NextApiRequest, NextApiResponse} from 'next'
import {client} from "../../../lib/astra";


const minQuery = `SELECT MIN(block_number) as min FROM ethereum.block_numbers_by_date WHERE date = ?;`
const maxQuery = `SELECT MAX(block_number) as max FROM ethereum.block_numbers_by_date WHERE date = ?;`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    const {startDate, endDate, walletAddress, tokenAddress} = req.body;
    const startResults = await client.execute(minQuery, [startDate], {prepare: true});
    const endResults = await client.execute(maxQuery, [endDate], {prepare: true});

    const minBlock = startResults.rows[0]?.min?.low;
    const maxBlock = endResults.rows[0]?.max?.low;

    const filteredResults: any = [];


    await new Promise((resolve) => {
      client.eachRow(`SELECT * FROM ethereum.token_transfers_by_token_address WHERE token_address = ? AND block_number >= ? AND block_number <= ?;`,
        [tokenAddress.toLowerCase(), minBlock, maxBlock],
        {prepare: true},
        (n, row) => {
          if (row.to_address.toLowerCase() === walletAddress.toLowerCase() || row.from_address.toLowerCase() === walletAddress.toLowerCase()) {
            filteredResults.push(row)
          }
        }, () => {
          resolve(filteredResults);
        });
    });

    return res.status(200).json({
      minBlock,
      maxBlock,
      results: filteredResults,
      ok: true
    });
  } catch (e) {
    return res.status(500).send({
      ok: false,
      results: [],
      e,
    });
  }
}
