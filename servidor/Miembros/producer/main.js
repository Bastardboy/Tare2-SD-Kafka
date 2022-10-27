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

var miembros = [];
var miembrosP = [];

app.post("/registrar", async (req, res) => {
  const { name, lastname, dni, email, patent, premium } = req.body;

  await producer.connect();

  console.log("CONECTAMOS AL PRODUCER")
  let user = {
    name: name,
    lastname: lastname,
    dni: dni,
    email: email,
    patent: patent,
    premium: premium,
  };

  datos = JSON.stringify(user);

  if(user["premium"] == 1){
    miembrosP.push(user);
    console.log("ENTRAMOS A UN PREMIUM");
    const TopicMsg = [
      {
        topic: "N_Miembro",
        partition: 1,
        messages: [{value: datos}],
      },
      {
        topic: "Stock",
        messages: [{value: datos}],
      }
    ]
    await producer.sendBatch({TopicMsg });
  }else{
    miembros.push(user);
    console.log("ENTRAMOS A UN NO PREMIUM");
    const TopicMsg = [
      {
        topic: "N_Miembro",
        partition: 0,
        messages: [{value: datos}],
      },
      {
        topic: "Stock",
        messages: [{value: datos}],
      }
    ]
    await producer.sendBatch({ TopicMsg });
  }
  console.log("ENVIAMOS LOS DATOS");
  await producer.disconnect();
  res.json({ user });

});

app.listen(port, () => {
  console.log(`Se levanto en http://localhost:${port}`);
});
