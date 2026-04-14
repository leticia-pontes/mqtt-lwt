const mqtt = require('mqtt');

const brokerUrl = 'mqtt://localhost:1883';
const clientId = 'nodejs-subscriber';
const topics = ['device/status', 'device/telemetry'];

const client = mqtt.connect(brokerUrl, {
  clientId,
  clean: true,
});

client.on('connect', () => {
  console.log('Subscriber conectado ao broker MQTT');
  client.subscribe(topics, { qos: 1 }, (err) => {
    if (err) {
      console.error('Falha ao subscrever tópicos:', err);
      return;
    }
    console.log('Inscrito em:', topics.join(', '));
  });
});

client.on('message', (topic, message) => {
  console.log(`Mensagem recebida em ${topic}: ${message.toString()}`);
});

client.on('error', (err) => {
  console.error('Erro MQTT:', err);
});
