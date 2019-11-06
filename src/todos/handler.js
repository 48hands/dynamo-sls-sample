const AWS = require('aws-sdk');
const uuid = require('uuid');
const Joi = require('@hapi/joi');

const dynamoDB = require('../dynamodb');

module.exports.getTodos = async (event, context) => {
  try {
    const result = await dynamoDB
      .scan({
        TableName: process.env.TODOS_TABLE
      })
      .promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err)
    };
  }
};

module.exports.createTodo = async (event, context) => {
  const { title, published } = JSON.parse(event.body);
  const timestamp = new Date().getTime();

  const params = {
    TableName: process.env.TODOS_TABLE,
    Item: {
      id: uuid.v1(),
      title: title,
      published: published,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  };

  try {
    await dynamoDB.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(params.Item)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err)
    };
  }
};
