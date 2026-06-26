const config = require('../config');
const logger = require('./logger');

let channel = null;
const EXCHANGE = 'cs2.events';

const connect = async () => {
  try {
    const amqp = require('amqplib');
    const connection = await amqp.connect(config.rabbitmq.url);
    channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
    logger.info('RabbitMQ connected (marketplace-service)');
    connection.on('error', () => { channel = null; });
    connection.on('close', () => {
      channel = null;
      setTimeout(connect, 10000);
    });
  } catch (err) {
    logger.warn(`RabbitMQ unavailable: ${err.message} — running without events`);
    setTimeout(connect, 10000);
  }
};

const publish = async (routingKey, payload) => {
  if (!channel) {
    logger.warn(`RabbitMQ not ready — skipping event: ${routingKey}`);
    return;
  }
  try {
    channel.publish(EXCHANGE, routingKey, Buffer.from(JSON.stringify(payload)), { persistent: true });
    logger.info(`Event published: ${routingKey}`);
  } catch (err) {
    logger.error(`Publish failed: ${err.message}`);
  }
};

module.exports = { connect, publish, EXCHANGE };
