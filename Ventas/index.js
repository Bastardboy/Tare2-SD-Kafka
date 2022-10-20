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

app.post("/venta", async (req, res) => {
  const {Cliente, Cantidad, Hora, Stock, Ubicacion} = req.body;
  const message = {
    Cliente,
    Cantidad,
    Hora,
    Stock,
    Ubicacion
  };

  await producer.connect();
  await producer.send({
    topic: "venta",
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