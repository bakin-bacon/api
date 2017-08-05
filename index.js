'use strict';

console.log('Loading function');

const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : "🥓",
        headers: {
            'Content-Type': 'application/json',
        },
    });

    var payload = {
      "TableName": "bakin-bacon-bacon-bits",
      "Item": JSON.parse(event.body)
    };
    dynamo.putItem(payload, done);
};

