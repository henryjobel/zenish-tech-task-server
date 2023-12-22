const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

// mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cmmcrj9.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        //change menuCollection with database name and collection.
        const taskCollection = client.db('taskyDB').collection("task")

        app.get('/task',async (req,res)=>{
            const result = await taskCollection.find().toArray()
            res.send(result)
        })

        app.get('/task/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await taskCollection.find(query).toArray()
            res.send(result)
        })

        app.post('/task', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task)
            res.send(result)
        })

        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.deleteOne(query)
            res.send(result)
        })

        app.put('/task/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const updatedTask = req.body;
            const task = {
                $set: {
                    priority: updatedTask.priority,
                    Title: updatedTask.Title,
                    Description: updatedTask.Description,
                    Deadline: updatedTask.Deadline,
                    status: updatedTask.status,
                }
            }
            const result = await taskCollection.updateOne(filter, task)
            res.send(result)

        })




        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



// testing
app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})