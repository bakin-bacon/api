'use strict';

const AWS = require('aws-sdk');
const SQS = new AWS.SQS({ apiVersion: '2012-11-05' });

console.log('Loading function');

const QueueUrl = process.env.SQS_QUEUE_URL;

if (!QueueUrl) {
  throw new Error('Environment variable "SQS_QUEUE_URL" was not set');
}

exports.post = (message, context, callback) => {
  console.log('Received message:', JSON.stringify(message));

  const done = (err, res) => {
    if (err) {
      callback({
        errorMessage: JSON.stringify(err.message)
      }, null);
      return;
    }

    callback(null, {
      "🥓": true
    });
  };

  const payload = {
    MessageBody: JSON.stringify(message),
    QueueUrl,
    MessageGroupId: 'bacon-bacon-bacon-bacon-bacon'
  };

  console.log('Message Payload:', JSON.stringify(payload));

  SQS.sendMessage(payload, done);
};
