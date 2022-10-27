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

var miembrosP = [];
var miembrosN = [];

const main = async () => {
  const consumer = kafka.consumer({ groupId: "N_Miembro" });
  console.log("Entra main")
  await consumer.connect();
  await consumer.subscribe({ topic: "N_Miembro", fromBeginning: true });
  console.log("producer");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      
      console.log("Registrando Miembro...");
      if(partition == 1)
      {
        console.log("Entramos en la particion 1: Usuarios Premium")
        var miembro = JSON.parse(message.value.toString());
        miembrosP.push(miembro); 
      }
      else if(partition == 0)
      {
        console.log("Entramos en la particion 0: Usuarios Normales")
        var miembro = JSON.parse(message.value.toString());
        miembrosN.push(miembro);
      }
      
      console.log("Miembros Premium:" , miembrosP.length)
      if(miembrosP.length > 0)
      {
        console.log(miembrosP)
      }
      console.log("Miembros Normales:" ,miembrosN.length)
      if(miembrosN > 0 )
      {
        console.log(miembrosN)
      }

    },
  })
}

app.listen(port,host,()=>{
    console.log(`Registro de miembros in: http://localhost:${port}.`)
    main()
});