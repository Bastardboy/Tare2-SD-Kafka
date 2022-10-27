const express = require('express');
const cors = require('cors');
const { Kafka } = require('kafkajs');
const { json } = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const kafka = new Kafka({
    brokers: ['kafka:9092']
});

var json = {}
var miembros = [];
var miembrosP = [];

const func = async () => {
    const consumer = kafka.consumer({ groupId: 'N_Miembro', fromBeginning: true });

    await consumer.connect();
    await consumer.subscribe({ topic: 'N_Miembro'});

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {  
            value = message.value
            
            console.log("Los datos son: ",value);

            json = JSON.parse(value)
            let find = json["premium"] // 1 - 0 y si es premium o no

            if(find == 1){
                miembrosP.push(json)
                console.log(miembrosP)
            }else{
                miembros.push(json)
                console.log(miembros)
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