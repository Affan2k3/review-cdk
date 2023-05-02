const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async function (event: any) {
  const params = {
    TableName: "Review-Section",
    KeyConditionExpression: "#sameid = :same",
    ExpressionAttributeNames: {
      "#sameid": "sameid",
    },
    ExpressionAttributeValues: {
      ":same": "same",
    },
  };

  try {
    const data = await dynamoDb.query(params).promise();
    const item = data.Items;
    console.log(item);
    return sendRes(200, JSON.stringify(item));
  } catch (err) {
    console.log(err);
    return sendRes(500, "Error getting item from DynamoDB");
  }
};

const sendRes = (status: any, body: any) => {
  var response = {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  };
  return response;
};
