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

var cpremium = [];
var cpnopremium = [];

const main = async () => {
  const consumer = kafka.consumer({ groupId: "members" });
  console.log("Entra main")
  await consumer.connect();
  await consumer.subscribe({ topic: "N_Miembro", fromBeginning: true });
  console.log("producer");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      
      console.log("Registrando Miembro...");
      if(partition == 1)
      {
        var miembro = JSON.parse(message.value.toString());
        cpremium.push(miembro); 
      }
      else if(partition == 0)
      {
        var miembro = JSON.parse(message.value.toString());
        cpnopremium.push(miembro);
      }
      
      console.log("Miembros Premium:" , cpremium.length)
      if(cpremium != null )
      {
        //console.log("Listado Miembros Premium:")
        console.log(cpremium)
      }

      console.log("Miembros No Premium:" ,cpnopremium.length)
      if(cpnopremium != null )
      {
        //console.log("Listado Miembros No Premium:")
        console.log(cpnopremium)
      }

    },
  })
}

app.listen(port,host,()=>{
    console.log(`Registro de miembros in: http://localhost:${port}.`)
    main()
});