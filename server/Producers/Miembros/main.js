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

var value = null;

var kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka:9092"],
});

app.post("/registro", (req, res) => {
  (async () => {
      const producer = kafka.producer();
      //const admin = kafka.admin();
      await producer.connect();
      const { name, lastname, dni, mail, patente, premium } = req.body;
      let member = {
        name: name,
        lastname: lastname,
        dni: dni,
        mail: mail,
        patente: patente,
        premium: premium,
      }
      value = JSON.stringify(member);
      if(member["premium"] == 1){
        const topicMessages = [
          {
            topic: 'N_Miembro',
            partition : 1,
            messages: [{value: JSON.stringify(member), partition: 1}]
          },
        ]
        await producer.sendBatch({ topicMessages })
      }else{
        
        const topicMessages = [
          {
            topic: 'N_Miembro',
            messages: [{value: JSON.stringify(member), partition: 0}]
          },
        ]
        await producer.sendBatch({ topicMessages })
      }

      await producer.disconnect();

      res.json("Agregado");  
    })();

});

app.listen(port,host, () => {
  console.log(`API run in: http://localhost:${port}.`);
});
