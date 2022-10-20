const express = require("express");
const cors = require("cors");
const { Kafka } = require('kafkajs')

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

const kafka = new Kafka({
  brokers: [process.env.kafkaHost]
});

const producer = kafka.producer();

app.get("/", async (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`API RUN AT http://localhost:${port}`);
});