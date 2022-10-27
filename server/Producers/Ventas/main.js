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

var kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka:9092"],
});

app.post("/ventas", (req, res) => {

  (async () => {
      const producer = kafka.producer();
      await producer.connect();
      const { cliente, cant_sopaipa, hora, stock, ubicacion } = req.body;

      let sale = {
        cliente: cliente,
        cant_sopaipa: cant_sopaipa,
        hora: hora,
        stock: stock,
        ubicacion: ubicacion
      }
      const topicMessages = [
        {
          // Como el carrito de sopaipillas es usado, es mandado a la particion 0 de la cola de ventas,
          // De esta forma se puede saber que el carrito está en una zona segura
            topic: 'ubicacion',
            partition: 0,
            messages: [{key: 'key1', value: JSON.stringify(sale), partition: 0}]
        },
        {
          // Se envia al tópico de ventas, se usará para los cálculos de las ventas diarias
          topic: 'venta',
          messages: [{value: JSON.stringify(sale)}]
        },
        {
            // El Stock se mantiene en esucha constante
            //Entonces al enviarle al topic stock, debe ser capaz de ver el stock restante que tiene el carrito
            topic: 'stock',
            messages: [{value: JSON.stringify(sale)}]
        }
    ]
      await producer.sendBatch({ topicMessages })
      await producer.disconnect();
      res.json(sale);
      console.log('Venta registrada')
  })();
});



  ///////////////////////////////////////////////////////////////  


app.get("/", (req, res) => {
  res.send("ola api");
});


/* PORTS */

app.listen(port,host, () => {
  console.log(`API run in: http://localhost:${port}.`);
});
