import cassandra from "cassandra-driver";
import path from "path";
import {
  ASTRA_DB_TOKEN,
  ASTRA_DB_CREDENTIALS_ZIP_FILE_PATH,
} from "./constants";

export const client = new cassandra.Client({
  cloud: {
    secureConnectBundle: path.resolve(".") + ASTRA_DB_CREDENTIALS_ZIP_FILE_PATH,
  },
  credentials: { username: "token", password: ASTRA_DB_TOKEN },
});
