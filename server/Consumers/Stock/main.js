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

var stock = [];

const main = async () => {

  const consumer = kafka.consumer({ groupId: "stock" });
  await consumer.connect();
  await consumer.subscribe({ topic: "stock", fromBeginning: true });

  await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        var algo = JSON.parse(message.value.toString());

        if(algo["stock"] <= 5){
          console.log("Stock MENOR A 5, SE AGREGA A LA COLA DE MENSAJE PARA NOTIFICAR");
          stock.push(algo["patente"]);
          console.log("TAMAÑO DEL ARREGLO, ES DECIR CUANTOS SE HAN METIDO " + stock.length);
        }
        if(stock.length == 5){
          console.log("LA COLA DE NOTIFICACION ESTA LLENA, SE PROCEDE A MOSTRAR LOS CARRITOS CON FALTA ADE SOPAIPILLAS");
          console.log("Patente de los carritos: "+stock+" con falta de sopapillas");
          stock = [];
        }
      },
    })
};

app.listen(port, host, () => {
  console.log(`API-Blocked run in: http://localhost:${port}.`);
  main();
});
