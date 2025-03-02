import { createClient } from "@clickhouse/client";

// setting clickhouse client
const client = createClient({
  url: process.env.CLICKHOUSE_HOST,
  database: process.env.CLICKHOUSE_DB,
  username: process.env.CLICKHOUSE_USERNAME,
  password: process.env.CLICKHOUSE_PASSWORD,
});

export const getLogs = async (req, res) => {
  try {
    const { deploymentId } = req.body;
    const logs = await client.query({
      query: `SELECT event_id, deployment_id, log, timestamp FROM log_events WHERE deployment_id = {deployment_id:String}`,
      query_params: { deployment_id: deploymentId },
      format: "JSONEachRow",
    });
    const rawLogs = await logs.json();
    return res.status(200).json({ logs: rawLogs });
  } catch (error) {
    console.log("Error sending logs", error);
    return res.status(500).json({ message: "Something went Wrong" });
  }
};
