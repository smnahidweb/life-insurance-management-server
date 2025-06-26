require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.82poriq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const database = client.db("fastDeliveryDB");
    const parcelCollection = database.collection("parcels");

    // Basic POST: Save Parcel
    app.post('/parcels', async (req, res) => {
      const parcel = req.body;
      const result = await parcelCollection.insertOne(parcel);
      res.send(result);
    });


    // get parcel using email 
    app.get('/parcels', async (req, res) => {
  try {
    const email = req.query.email;
    let query = {};

    if (email) {
      query = { created_by: email };
    }

    const result = await parcelCollection
      .find(query)
      .sort({ creation_date: -1 }) // Latest first
      .toArray();

    res.send(result);
  } catch (error) {
    console.error("Error fetching parcels:", error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});



  app.get('/parcels/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await parcelCollection.findOne(query);
      res.send(result);
    });



// delete parcel
    const { ObjectId } = require('mongodb');

app.delete('/parcels/:id', async (req, res) => {
  const id = req.params.id;

  // ✅ Check if the ID is a valid MongoDB ObjectId
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ error: 'Invalid ID format' });
  }

  const query = { _id: new ObjectId(id) };

  try {
    const result = await parcelCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: 'Parcel not found' });
    }

    res.send(result);
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});




















    // Basic GET: Track Parcel by trackingId
    app.get('/track/:trackingId', async (req, res) => {
      const trackingId = req.params.trackingId;
      const result = await parcelCollection.findOne({ trackingId });
      res.send(result || { message: "Not Found" });
    });

    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Error connecting to DB:", err);
  }
}
run();

app.get('/', (req, res) => {
  res.send("🚀 Fast Delivery server is running");
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
