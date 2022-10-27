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

var value = null;
var json = {};
var stock = [];

const main = async () => {
  console.log("Entra stock");

  const consumer = kafka.consumer({ groupId: "group-stock" });
  await consumer.connect();
  await consumer.subscribe({ topic: "stock", fromBeginning: true });
  console.log("producer");

  await consumer
    .run({
      eachMessage: async ({ topic, partition, message }) => {
        value = message.value;
        var algo = JSON.parse(message.value.toString());
        console.log(algo);
        json = JSON.parse(value);

        if (json["stock"] <= 3) {
          stock.push(json);
          if (stock.length == 5) {
            console.log(
              "Hay 5 miembros registrados con stock para reposicionar"
            );
            console.log(stock);
            stock = [];
          }
        }
      },
    })
    .catch(console.error);
};

//asdlaskdj
app.get("/blocked", (req, res) => {
  res.send(bloqueados);
});
/* PORTS */

app.listen(port, host, () => {
  console.log(`API-Blocked run in: http://localhost:${port}.`);
  main();
});
