//Codigo referencial para la estructura de los productores y consumidores https://github.com/Joacker/SD-Homeworks2

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

var kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka:9092"],
});

var value = null
var json = {}
var stock = []
//var registro = {};
const main = async () => {
  const consumer = kafka.consumer({ groupId: "ubication" });
  
  await consumer.connect();
  await consumer.subscribe({ topic: "ubicacion", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      var value = JSON.parse(message.value.toString());
      if(partition == 0)
      {
        console.log("Entra a particion 0")
        console.log("Carrito ok")
      }
      else if(partition == 1)
      {
        console.log("Entra en particion 1")
        console.log("Este carrito es profugo, patente:", value["patente"])
      }
    },
  })
}

app.listen(port,host,()=>{
    console.log(`API-Blocked run in: http://localhost:${port}.`)
    main()
});