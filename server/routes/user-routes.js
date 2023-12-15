const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

const awsConfig = {
    region: 'us-east-1'
}
AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient()
const table = 'Thoughts'

router.get('/users', (req, res) => {
    const params ={
        TableName: table
    };
    //Scan return all items in the table
    dynamodb.scan(params, (err, data) => {
        if(err){
            res.status(500).json(err)
        }else{
            res.json(data.Items)
        }
    })
})

router.get('/users/:username', (req, res) => {
    console.log(`Querying for thought(s) from ${req.params.username}.`);

    const params = {
        TableName: table,
        ProjectionExpression: '#un, #th, #ca, #img',
        KeyConditionExpression: '#un = :user',
        ExpressionAttributeNames: {
            '#un': 'username',
            '#ca': 'createdAt',
            '#th': 'thought',
            "#img": "image",
        },
        ExpressionAttributeValues: {
            ':user': req.params.username
        },
        ScanIndexForward: false,
    }

    dynamodb.query(params, (err, data) => {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            res.status(500).json(err) // an error occurred
        } else {
            console.log("query succeeded");
            res.json(data.Items)
        }
    });
});

router.post('/users', (req, res) => {
    const params = {
        TableName: table,
        Item: {
            username: req.body.username,
            createdAt: Date.now(),
            thought: req.body.thought,
            image: req.body.image
        }
    };
    dynamodb.put(params, (err, data) => {
        if(err){
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            res.status(500).json(err)
        }else{
            console.log("Added item:", JSON.stringify(data, null, 2));
            res.json({"Added": JSON.stringify(data, null, 2)})
        }
    })
})

module.exports = router;