import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

export const handler = async () => {
  const result = await client.send(
    new ScanCommand({ TableName: "buyology-products" })
  );

  const products = (result.Items ?? []).map((item) => unmarshall(item));

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
    },
    body: JSON.stringify(products),
  };
};
