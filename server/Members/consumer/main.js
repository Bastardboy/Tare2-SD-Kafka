const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const { Kafka } = require("kafkajs");

const app = express()
dotenv.config()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use(cors())

var port = process.env.PORT || 8000;
var host = process.env.PORT || '0.0.0.0';

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka:9092"],
});

const topic = "N_Miembro";
const consumer = kafka.consumer({ groupId: "test-group" });


var value = null
var json = {}
var registro = {};
var bloqueados = [];

const main = async () => {
  console.log("Entra main")
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      value = message.value
      console.log({
        value: message.value.toString(),
      })
      
    },
  })
  .catch(console.error)
};

main();