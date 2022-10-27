//Codigo referencial para la estructura de los productores y consumidores https://github.com/Joacker/SD-Homeworks2

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { Kafka } = require("kafkajs");

const app = express();
dotenv.config();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8000;
var host = process.env.PORT || "0.0.0.0";

var kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka:9092"],
});

var venta = [];

const main = async () => {
  const consumer = kafka.consumer({ groupId: "venta" });
  await consumer.connect();
  await consumer.subscribe({ topic: "venta", fromBeginning: true });


  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      var venta = JSON.parse(message.value.toString());

      console.log("Venta registrada: ", venta);

      venta.push(venta);

      // if(stock.includes(json)){
      //   console.log('Consulta ya guardada')
      // }else{
      //   stock.push(json)
      //   if(stock.length==5){
      //     console.log('Lista de 5 consultas guardadas')
      //     console.log(stock)
      //   }
      // }
    },
  });
};

app.listen(port, host, () => {
  console.log(`API-Blocked run in: http://localhost:${port}.`);
  main();
});
