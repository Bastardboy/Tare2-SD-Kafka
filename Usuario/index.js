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

app.post("/registrar", async (req, res) => {
  const { nombre, apellido, rut, email, patente, premium } = req.body;
  const message = {
    nombre,
    apellido,
    rut,
    email,
    patente,
    premium
  };
  await producer.connect();
  if (premium === "true") {
    await producer.send({
      topic: "premium",
      messages: [
        { value: JSON.stringify(message) }
      ]
    })
  } else{
    await producer.send({
      topic: "registro",
      messages: [
        { value: JSON.stringify(message) }
      ]
    })
  }
  
  await producer.disconnect();
  res.status(200).send();
  
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});