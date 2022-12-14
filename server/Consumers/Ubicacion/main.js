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


var carrito = []
var carritoP = []

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const ubicacion_check = async () => {
  while(true){
    await sleep(5000)
    for(let i=0; i<=carrito.length-1; i++)
    {
      if((Date.now()/1000 - carrito[i]["tiempo"]) > 60){
        console.log("Borrando ubicacion de carrito:",carrito[i]["patente"]);
        carrito.splice(i,1);
      }
    }
  }
}

const main = async () => {
  const consumer = kafka.consumer({ groupId: "ubicacion" });
  
  await consumer.connect();
  await consumer.subscribe({ topic: "ubicacion", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      var value = JSON.parse(message.value.toString());

      if(partition == 0)
      {
        console.log("Entra a particion 0")
        console.log("Carrito esta bien")

        
        var find = false;
        for(let i=0; i<=carrito.length-1; i++)
        {
          if(carrito[i]["patente"] === value["patente"]){
            find = true;
            carrito[i]["ubicacion"] = value["ubicacion"];
            carrito[i]["tiempo"] = Date.now()/1000;
            console.log("actualizando ubicacion de carrito "+carrito[i]["patente"]+" a "+carrito[i]["ubicacion"]);
          }
        }
        if(!find){
          carrito.push({"patente":value["patente"],"ubicacion":value["ubicacion"],"tiempo":Date.now()/1000});
          console.log("añadiendo ubicacion de carrito "+value["patente"],"(Ubicacion:",value["ubicacion"]+")")
        }
        

      }
      else if(partition == 1)
      {
        carritoP.push(value["ubicacion"]);
        console.log("Entra en particion 1")
        console.log("Este carrito es profugo, patente:", value["patente"])
        console.log(carritoP)
      }
    },
  })
}

ubicacion_check()

app.listen(port,host,()=>{
    console.log(`API-Blocked run in: http://localhost:${port}.`)
    main()
});