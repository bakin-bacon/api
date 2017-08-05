'use strict';

console.log(`Loading function ${process.env.AWS_FUNCTION_NAME}`);

const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();

exports.handler = (baconBit, context, callback) => {
    console.log('Received 🥓:', JSON.stringify(baconBit));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : "🥓",
        headers: {
            'Content-Type': 'application/json',
        },
    });

    var payload = {
      "TableName": "bakin-bacon-bacon-bits",
      "Item": baconBit
    };
    dynamo.putItem(payload, done);
};

