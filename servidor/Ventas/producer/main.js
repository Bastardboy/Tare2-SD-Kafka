const express = require('express');
const cors = require('cors');
const { Kafka } = require('kafkajs');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const kafka = new Kafka({
    brokers: ['kafka:9092']
});



app.post('/venta', async(req, res) => {
    const producer = kafka.producer();
    await producer.connect();

    const { name, lastname, cant_sopai, hora, stock_restante, ubicacion } = req.body;
    let user = {
        name: name,
        lastname: lastname,
        cant_sopai: cant_sopai,
        hora: hora,
        stock_restante: stock_restante,
        ubicacion: ubicacion,
    };

    datos = JSON.stringify(user);

    const TopicMsg = [
        {
            topic: 'venta',
            messages: [ datos ],
        },
        {
            topic: 'stock',
            messages: [ datos ],
        }
    ]
    await producer.sendBatch({ TopicMsg });

    await producer.disconnect().then(
        res.status(200).json({
            message: 'Venta Registrada'
        })
    )
})

app.listen(port, () => {
    console.log(`Se levanto en http://localhost:${port}`)
})