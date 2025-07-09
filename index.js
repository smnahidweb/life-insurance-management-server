require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hq0xigy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());

async function run() {
  try {
    const database = client.db("life_insurance");
    const policiesCollection = database.collection("policies");
    const usersCollection = database.collection("users"); // ✅ FIXED

    app.post('/users', async (req, res) => {
      const user = req.body;
      const existingUser = await usersCollection.findOne({ email: user.email });

      if (existingUser) {
        return res.status(409).send({ message: "User already exists" });
      }

      const result = await usersCollection.insertOne(user);
      res.status(201).send(result);
    });


// get users info by email
app.get('/users/:email/role', async (req, res) => {
  const email = req.params.email;

  try {
    const user = await usersCollection.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found", role: 'customer' });
    }
    return res.json({ role: user.role || 'customer' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



























    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // You may choose not to close the connection here to keep the server running
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Life Sure is running');
});

app.listen(port, () => {
  console.log(`Life sure server is listening on port ${port}`);
});
