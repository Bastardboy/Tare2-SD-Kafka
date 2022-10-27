<<<<<<< HEAD

const { Kafka } = require('kafkajs');
const { cors } = require('cors');
const fs = require('fs');

run().then(() => console.log("Done"), err => console.log(err));

async function run() {
  const kafka = new Kafka({ brokers: ["kafka:9092"] });
  // If you specify the same group id and run this process multiple times, KafkaJS
  // won't get the events. That's because Kafka assumes that, if you specify a
  // group id, a consumer in that group id should only read each message at most once.
  const consumer = kafka.consumer({ groupId: "N-consumer" + Date.now() });

  await consumer.connect();
  await consumer.subscribe({ topic: "N_Miembro", fromBeginning: true });

  await consumer.run({ 
    eachMessage: async (data) => {
        // console.log(data);
        if(data.message){
            // console.log(data.message.value);

            var d = JSON.parse(data.message.value.toString())
            console.log(d)
            var newData = JSON.stringify(d);
            fs.writeFile('./db/init.json', newData, err => {
                // error checking
                if(err) throw err;
                
                console.log("New data added");
            });
        }
    }
  });
};
=======
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
>>>>>>> 91275b34dad9faed2cbabc5c8a00d453d609dede
