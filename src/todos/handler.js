const AWS = require('aws-sdk');
const uuid = require('uuid');
const Joi = require('@hapi/joi');

const dynamoDB = require('../dynamodb');

// Get Todos
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

// Create Todo
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

// Update Todo
module.exports.updateTodo = async (event, context) => {
  const id = event.pathParameters.id;
  const { title, published } = JSON.parse(event.body);
  const timestamp = new Date().getTime();
  try {
    const result = await dynamoDB
      .update({
        TableName: process.env.TODOS_TABLE,
        Key: {
          id
        },
        UpdateExpression:
          'SET title = :title, published = :published, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':title': title,
          ':published': published,
          ':updatedAt': timestamp
        }
      })
      .promise();

    return {
      statusCode: 200,
      body: {
        body: JSON.stringify(result.Attributes)
      }
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err)
    };
  }
};

// Delete Todo
module.exports.deleteTodo = async (event, context) => {
  const id = event.pathParameters.id;
  try {
    await dynamoDB
      .delete({
        TableName: process.env.TODOS_TABLE,
        Key: {
          id
        }
      })
      .promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Deleted Todo with id ${id}`
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err)
    };
  }
};
