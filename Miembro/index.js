const express = require("express");
const cors = require("cors");
const { Kafka } = require('kafkajs')

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

const kafka = new Kafka({
  brokers: [process.env.kafkaHost]
});

const producer = kafka.producer();
const consummer = kafka.consumer({ groupId: 'test-group' });


app.post("/login", async (req, res) => {
  

});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});