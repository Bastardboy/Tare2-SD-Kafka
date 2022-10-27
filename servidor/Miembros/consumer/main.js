
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
