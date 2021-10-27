const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors')


const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jo0ws.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//insert document
async function run() {
    try {
        await client.connect();
        // console.log("connected to database");
        const database = client.db("carMechanic");
        const serviceCollection = database.collection("services");

        // Get API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        //GEt single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)
            res.json(service)
        })
        //post API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log("hit the api", service);
            const result = await serviceCollection.insertOne(service);
            res.json(result)
        })

        //delete API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query)
            console.log(result)
            res.json(result)
        })
    } finally {
        // await client.close();
    }
}

//call the function  
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running Genius Server')
});

app.listen(port, () => {
    console.log("running genius server on port", port)
})