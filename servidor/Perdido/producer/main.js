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

const producer = kafka.producer();

app.post('/perdido', async(req, res) => {
    const { ubicacion } = req.body;
    let user = {
        ubicacion: ubicacion,
    };
    await producer.connect();
    await producer.send({
        topic: 'Perdido',
        messages: [{ value: JSON.stringify(user) }],
    });
    await producer.disconnect().then(
        res.status(200).json({
            message: 'Ubicacion Registrada'
        })
    )
})

app.listen(port, () => {
    console.log(`Se levanto en http://localhost:${port}`)
})