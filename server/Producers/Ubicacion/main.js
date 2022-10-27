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

var port = process.env.PORT || 3000;
var host = process.env.PORT || '0.0.0.0';

var value = null
var kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka:9092"],
});

app.post("/ubicacion", (req, res) => {
  
  (async () => {
      const producer = kafka.producer();
      
      await producer.connect();
      const { patente,coordenadas , denuncia } = req.body;
      today = new Date();
      let localizacion = {
        patente: patente,
        coordenadas:coordenadas,
        denuncia:denuncia ,
      }
      value = JSON.stringify(localizacion)
      
      //Al igual que en el producer de miembros, dependiendo de la "opcion"
      //se envia a una particion u otra 1 = carritos profugos 0 = carritos seguros

      if(localizacion["denuncia"] == 1){
        const topicMessages = [
          {
            topic: 'ubicacion',
            partition : 1,
            messages: [{value: JSON.stringify(localizacion), partition: 1}]
          },
        ]
        await producer.sendBatch({ topicMessages })
      }else{
        
        const topicMessages = [
          {
            topic: 'ubicacion',
            partition: 0,
            messages: [{value: JSON.stringify(localizacion), partition: 0}]
          },
        ]
        await producer.sendBatch({ topicMessages })
      }
      await producer.disconnect();
      res.json(localizacion);
  })();
});

app.listen(port,host, () => {
  console.log(`API run in: http://localhost:${port}.`);
});