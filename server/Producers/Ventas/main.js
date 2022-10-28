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
      const { cliente, cant_sopaipa, patente, stock, ubicacion } = req.body;

      const today = new Date();
      const yyyy = today.getFullYear();
      let mm = today.getMonth() + 1; // Months start at 0!
      let dd = today.getDate();

      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;

      const formattedToday = dd + '/' + mm + '/' + yyyy;

      let V = {
        cliente: cliente,
        cant_sopaipa: cant_sopaipa,
        dia: formattedToday,
        patente: patente,
        stock: stock,
        ubicacion: ubicacion
      }
      const topicMessages = [
        {
          // Como el carrito de sopaipillas es usado, es mandado a la particion 0 de la cola de ventas,
          // De esta forma se puede saber que el carrito está en una zona segura
            topic: 'ubicacion',
            partition: 0,
            messages: [{value: JSON.stringify(V), partition: 0}]
        },
        {
          // Se envia al tópico de ventas, se usará para los cálculos de las ventas diarias
          topic: 'venta',
          messages: [{value: JSON.stringify(V)}]
        },
        {
            // El Stock se mantiene en esucha constante
            //Entonces al enviarle al topic stock, debe ser capaz de ver el stock restante que tiene el carrito
            topic: 'stock',
            messages: [{value: JSON.stringify(V)}]
        }
    ]
      await producer.sendBatch({ topicMessages })
      await producer.disconnect();
      res.json(V);
      console.log('Venta registrada')
  })();
});

app.listen(port,host, () => {
  console.log(`API run in: http://localhost:${port}.`);
});
