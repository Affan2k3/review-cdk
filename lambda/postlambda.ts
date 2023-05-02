const AWSS = require("aws-sdk");
const dynamoDbb = new AWSS.DynamoDB.DocumentClient();

exports.handler = async function (event: any) {
  const { id, fullname, review } = JSON.parse(event.body);
  const params = {
    TableName: "Review-Section",
    Item: {
      sameid: "same",
      id: id,
      fullname: fullname,
      review: review,
    },
  };
  try {
    await dynamoDbb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data saved successfully" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while saving the data",
      }),
    };
  }
};
