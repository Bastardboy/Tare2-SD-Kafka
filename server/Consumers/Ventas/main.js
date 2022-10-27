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

var ventas = [];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const desplegar_ventas = async () => {
  var minutos = 1;
  await sleep(1000*60*minutos)

  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const formattedToday = dd + '/' + mm + '/' + yyyy;

  console.log("Ventas de hoy ("+formattedToday+"): ")
  for(let i=0; i<=ventas.length-1; i++)
  {
    if(formattedToday == ventas[i]["dia"]){
      console.log(JSON.stringify(ventas[i]));
    }
  }
}

const main = async () => {
  const consumer = kafka.consumer({ groupId: "venta" });
  await consumer.connect();
  await consumer.subscribe({ topic: "venta", fromBeginning: true });


  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      var venta = JSON.parse(message.value.toString());

      console.log("Venta registrada: ", venta);

      ventas.push(venta);

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

desplegar_ventas();

app.listen(port, host, () => {
  console.log(`API-Blocked run in: http://localhost:${port}.`);
  main();
});