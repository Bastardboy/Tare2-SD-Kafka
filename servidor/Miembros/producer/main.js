const express = require("express");
const cors = require("cors");
const { Kafka } = require("kafkajs");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const kafka = new Kafka({
  brokers: ["kafka:9092"],
});

const producer = kafka.producer();

app.post("/registrar", async (req, res) => {
  const { name, lastname, dni, email, patent, premium } = req.body;
  let user = {
    name: name,
    lastname: lastname,
    dni: dni,
    email: email,
    patent: patent,
    premium: premium,
  };
    await producer.connect();
    await producer.send({
      topic: 'N_Miembro',
      messages: [{ value: JSON.stringify(user) }],
    });
    await producer.disconnect().then(
      res.status(200).json({
        message: "Miembro Registrado",
      })
    );
});

app.listen(port, () => {
  console.log(`Se levanto en http://localhost:${port}`);
});
