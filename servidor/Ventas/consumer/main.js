const express = require('express');
const cors = require('cors');
const { Kafka } = require('kafkajs');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const kafka = new Kafka({
    brokers: ['kafka:9092']
});

var ventas = [];

const func = async () => {
    const consumer = kafka.consumer({ groupId: 'N_Venta', fromBeginning: true });

    await consumer.connect();
    await consumer.subscribe({ topic: 'N_Venta'});

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if(message.value){
                var data = JSON.parse(message.value.toString());
                ventas.push(data);
                console.log(ventas);
            }
        },
    });
}

app.get('/', async(req, res) => {
    res.status(200).send('ENTRO A ESTA WEA!');
})

app.listen(port, () => {
    console.log(`VER-DATOS-REGISTRO run in: http://localhost:${port}.`);
    func();
})