import { createClient } from "@clickhouse/client";
import { Kafka } from "kafkajs";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
// Fix __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// configure kafka
const kafka = new Kafka({
  clientId: `Weblift-api-server`,
  brokers: [process.env.KAFKA_BROKER],
  ssl: {
    ca: [fs.readFileSync(path.join(__dirname, "../kafka.pem"), "utf-8")],
    rejectUnauthorized: false,
  },
  sasl: {
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
    mechanism: "plain",
  },
});
// setting clickhouse client
const client = createClient({
  url: process.env.CLICKHOUSE_HOST,
  database: process.env.CLICKHOUSE_DB,
  username: process.env.CLICKHOUSE_USERNAME,
  password: process.env.CLICKHOUSE_PASSWORD,
});

export const initKafkaConsumer = async () => {
  try {
    const consumer = kafka.consumer({
      groupId: "weblift-api-server-logs-consumer",
    });
    await consumer.connect();
    await consumer.subscribe({ topic: "logs", fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) return;
        const { PROJECT_ID, DEPLOYEMENT_ID, log } = JSON.parse(
          message.value.toString()
        );
        // console.log({
        //   value: message.value.toString(),
        // });
        // console.log({ log, DEPLOYEMENT_ID }); // This confirms the message data
        try {
          // Insert into ClickHouse (make sure the table 'log_events' exists and its schema is correct)
          const { query_id } = await client.insert({
            table: "log_events",
            values: [
              { event_id: uuidv4(), deployment_id: DEPLOYEMENT_ID, log },
            ],
            format: "JSONEachRow",
          });
          // console.log("Log Inserted in ClickHouse", query_id);
        } catch (err) {
          console.error("Error inserting log into ClickHouse:", err);
        }
      },
    });
  } catch (error) {
    console.error("Error", error);
  }
};
