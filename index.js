'use strict';

console.log(`Loading function`);

const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();

exports.post = (baconBit, context, callback) => {
    console.log('Received 🥓:', JSON.stringify(baconBit));

    var payload = {
      "TableName": "bakin-bacon-bacon-bits",
      "Item": baconBit
    };
    dynamo.putItem(payload, (err, res) => callback(err, {"🥓": true}));
};

exports.get = (event, context, callback) => {
    console.log('Asked to provide bacon bits...doing so...');

    var params = {};
    params.TableName = "bakin-bacon-bacon-bits";
    params.KeyConditionExpression = "#user_id = :name";
    params.ExpressionAttributeNames = { "#user_id": "user_id" };
    params.ExpressionAttributeValues = { ":name": "definitelynotgrant" };
   
    dynamo.query(params, (err, data) => {
      if (data) {
        callback(null, data.Items);
      }
      else {
        callback(err, null);
      }
    });
};
