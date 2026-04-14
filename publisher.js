const mqtt = require('mqtt');

const brokerUrl = 'mqtt://localhost:1883';
const clientId = 'nodejs-publisher';
const statusTopic = 'device/status';
const telemetryTopic = 'device/telemetry';

const client = mqtt.connect(brokerUrl, {
  clientId,
  clean: true,
  will: {
    topic: statusTopic,
    payload: 'offline',
    qos: 1,
    retain: true,
  },
});

client.on('connect', () => {
  console.log('Conectado ao broker MQTT');

  client.publish(statusTopic, 'online', { qos: 1, retain: true }, (err) => {
    if (err) {
      console.error('Erro ao publicar status online:', err);
      return;
    }
    console.log('Status online publicado com retain flag.');
  });

  const telemetryPayload = JSON.stringify({ temperature: 27.5, humidity: 62, timestamp: new Date().toISOString() });
  client.publish(telemetryTopic, telemetryPayload, { qos: 0, retain: true }, (err) => {
    if (err) {
      console.error('Erro ao publicar telemetria:', err);
      return;
    }
    console.log('Telemetria publicada com retain flag:', telemetryPayload);
  });
});

client.on('error', (err) => {
  console.error('Erro MQTT:', err);
});

process.on('SIGINT', () => {
  console.log('\nDesconexão voluntária detectada. Publicando offline antes de encerrar.');
  client.publish(statusTopic, 'offline', { qos: 1, retain: true }, () => {
    client.end(false, () => {
      console.log('Conexão encerrada com sucesso. LWT não será disparado.');
      process.exit(0);
    });
  });
});
