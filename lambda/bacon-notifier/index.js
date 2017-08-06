'use strict';

const AWS = require('aws-sdk');
const Expo = require('exponent-server-sdk');
const SQS = new AWS.SQS({ apiVersion: '2012-11-05' });
const Lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });

// Your queue URL stored in the queueUrl environment variable
const QUEUE_URL = process.env.queueUrl;

function poll(callback) {
	console.log('Processing SQS messages');
	const params = {
		QueueUrl: QUEUE_URL,
		MaxNumberOfMessages: 10,
		VisibilityTimeout: 10,
	};
	// batch request messages
	SQS.receiveMessage(params, (err, data) => {
		if (err) {
			console.log('Error receiving messages');
			return callback(err);
		}
		// for each message, reinvoke the function
		console.log('Data: ', data);
		const messages = data.Messages || [];
		const payload = messages.map((message) => (
			{
				"to": JSON.parse(message.Body).device_token,
				"body": "Yo dawg. I heard you ate bacon. Howdatpig?"
			}));

		let expo = new Expo();
		console.log('Pushing notificaitons: ', payload);
		expo.sendPushNotificationsAsync(payload)
			.then((receipts) => console.log(receipts))
			.catch((error) => console.error(error))
			.then(() => Promise.all(
				messages.map(message => new Promise((resolve, reject) => {
					console.log('Deleting message: ', message.MessageId);
					SQS.deleteMessage({
						QueueUrl: QUEUE_URL,
						ReceiptHandle: message.ReceiptHandle
					}, (err, res) => {
						if (err) {
							reject(err);
						} else {
							resolve(res);
						}
					});
				}))))
			.then((results) => callback(null, results))
			.catch((err) => callback(err, null));
	});
}

exports.handler = (event, context, callback) => {
	try {
		poll(callback);
	} catch (err) {
		callback(err);
	}
};
