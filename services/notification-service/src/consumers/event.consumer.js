const config = require('../config');
const logger = require('../utils/logger');
const notificationRepository = require('../repositories/notification.repository');

const EXCHANGE = 'cs2.events';
const QUEUE = 'notification.queue';

const eventHandlers = {
  'user.registered': async (payload) => {
    await notificationRepository.create({
      userId: payload.userId,
      type: 'USER_REGISTERED',
      title: 'Welcome to CS2 Marketplace!',
      message: `Hi ${payload.username}, your account has been created successfully.`,
      metadata: JSON.stringify({ email: payload.email }),
    });
  },
  'order.created': async (payload) => {
    await notificationRepository.create({
      userId: payload.userId,
      type: 'ORDER_CREATED',
      title: 'Order Placed',
      message: `Your order #${payload.orderId} has been placed. Total: $${payload.totalAmount}`,
      metadata: JSON.stringify({ orderId: payload.orderId }),
    });
  },
  'payment.completed': async (payload) => {
    await notificationRepository.create({
      userId: payload.userId,
      type: 'PAYMENT_COMPLETED',
      title: 'Payment Successful',
      message: `Payment of $${payload.amount} for order #${payload.orderId} completed.`,
      metadata: JSON.stringify({ orderId: payload.orderId }),
    });
  },
  'order.cancelled': async (payload) => {
    await notificationRepository.create({
      userId: payload.userId,
      type: 'ORDER_CANCELLED',
      title: 'Order Cancelled',
      message: `Your order #${payload.orderId} has been cancelled.`,
      metadata: JSON.stringify({ orderId: payload.orderId }),
    });
  },
  'skin.added': async (payload) => {
    logger.info(`skin.added event: skinId=${payload.skinId}`);
  },
  'skin.updated': async (payload) => {
    logger.info(`skin.updated event: skinId=${payload.skinId}`);
  },
};

const startConsuming = async () => {
  try {
    const amqp = require('amqplib');
    const connection = await amqp.connect(config.rabbitmq.url);
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
    const q = await channel.assertQueue(QUEUE, { durable: true });

    for (const key of Object.keys(eventHandlers)) {
      await channel.bindQueue(q.queue, EXCHANGE, key);
    }

    channel.prefetch(1);
    logger.info(`📬 Notification consumer listening on: ${QUEUE}`);

    channel.consume(q.queue, async (msg) => {
      if (!msg) return;
      const routingKey = msg.fields.routingKey;
      let payload = {};
      try {
        payload = JSON.parse(msg.content.toString());
        const handler = eventHandlers[routingKey];
        if (handler) await handler(payload);
        await notificationRepository.logEvent({ event: routingKey, payload: JSON.stringify(payload), status: 'SUCCESS' });
        channel.ack(msg);
      } catch (err) {
        logger.error(`Event error [${routingKey}]: ${err.message}`);
        await notificationRepository.logEvent({ event: routingKey, payload: JSON.stringify(payload), status: 'FAILED', error: err.message }).catch(() => {});
        channel.nack(msg, false, false);
      }
    });

    connection.on('close', () => {
      logger.warn('RabbitMQ closed — reconnecting in 10s');
      setTimeout(startConsuming, 10000);
    });
  } catch (err) {
    logger.warn(`RabbitMQ consumer unavailable: ${err.message} — retry in 10s`);
    setTimeout(startConsuming, 10000);
  }
};

module.exports = { startConsuming };
