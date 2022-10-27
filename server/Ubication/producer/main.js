//Codigo referencial para la estructura de los productores y consumidores https://github.com/Joacker/SD-Homeworks2

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { Kafka } = require("kafkajs");
const { json } = require("body-parser");


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
var host = process.env.PORT || '0.0.0.0';
var CarroProfugo = null
var kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka:9092"],
});

app.post("/ubication", (req, res) => {
  console.log("Ubication");
  (async () => {
      const producer = kafka.producer();

      await producer.connect();
      const { id,coordenadas , denuncia } = req.body;
      var time = Math.floor(new Date() / 1000);
      let ubication = {
        id: id,
        coordenadas:coordenadas,
        denuncia:denuncia ,
        tiempo: time.toString()
      }
      if(ubication["denuncia"] == 1){
        console.log("Este carrito ha sido denunciado, es profugo")

         CarroProfugo = [{
            topic: 'ubication',
            messages:[{value:JSON.stringify(ubication),partition : 1}]
          }
        ]
      }
      else if(ubication["denuncia"]==0){
        console.log("Carrito Limpio.")

         CarroProfugo = [{
          topic: 'ubication',
          partition:0,
          messages:[{value:JSON.stringify(ubication)}]
          }
        ]

      }
      await producer.sendBatch({CarroProfugo})
      await producer.disconnect();
      res.json(ubication);
  })();
});


app.listen(port,host, () => {
  console.log(`API run in: http://localhost:${port}.`);
});
