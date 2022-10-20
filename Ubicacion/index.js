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

app.post("/ubicacion", async (req, res) => {
  const { patente, latitud, longitud } = req.body;
  const message = {
    patente,
    latitud,
    longitud
  };
  await producer.connect();
  await producer.send({
    topic: "ubicacion",
    messages: [
      { value: JSON.stringify(message) }
    ]
  })
  
  await producer.disconnect();
  res.status(200).send();
  
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});