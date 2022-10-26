"use strict";
//-------------------Librerias-----------------------------
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { Kafka } = require("kafkajs");

//----------------Configuración---------------------------
const app = express();
dotenv.config();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 3000;
var host = process.env.PORT || "0.0.0.0";

var kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka:9092"],
});

app.post("/registrar", (req, res) => {
  console.log("ENTRO REGISTRO");
  (async () => {
    const producer = kafka.producer();
    await producer.connect();
    const { name, lastname, rut, email, patent, premium } = req.body;
    let user = {
      name: name,
      lastname: lastname,
      dni: rut,
      mail: email,
      patente: patent,
      premium: premium,
    };
    await producer.send({
      topic: "N_Miembro",
      messages: [{ value: JSON.stringify(user) }],
    });
    await producer.disconnect();
    //await admin.disconnect();
    res.json(user);
  })();
});

app.listen(port, host, () => {
  console.log(`API run in: http://localhost:${port}.`);
});
