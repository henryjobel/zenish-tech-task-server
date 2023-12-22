const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const morgan = require('morgan')
const port = process.env.PORT || 5000
// middleware
const corsOptions = {
    origin: ['https://task-management-server-zeta-indol.vercel.app', 'http://localhost:5173'],
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

const client = new MongoClient(process.env.DB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
})

// code 
async function run() {
    try {
        const taskCollection = client.db('taskyDB').collection('task');

        app.get('/task/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await taskCollection.find(query).toArray();
            res.send(result);
        });

        app.post('/task', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        });

        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        });

        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedTask = req.body;
            const task = {
                $set: {
                    priority: updatedTask.priority,
                    Title: updatedTask.Title,
                    Description: updatedTask.Description,
                    Deadline: updatedTask.Deadline,
                    status: updatedTask.status,
                },
            };
            const result = await taskCollection.updateOne(filter, task);
            res.send(result);
        });
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send(' evoLearn server is runung..')
})

app.listen(port, () => {
    console.log(`EvoLearn is running on port ${port}`)
})
