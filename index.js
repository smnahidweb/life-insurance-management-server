require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
    await client.connect();

    const database = client.db("life_insurance");
    const policiesCollection = database.collection("policies");
    const usersCollection = database.collection("users");
    const quoteCollection = database.collection('quotes');
     const ApplicationsCollection = database.collection('application')
     const reviewsCollection = database.collection('reviews')

    // ✅ POST user
    app.post('/users', async (req, res) => {
      const user = req.body;
      const existingUser = await usersCollection.findOne({ email: user.email });

      if (existingUser) {
        return res.status(409).send({ message: "User already exists" });
      }

      const result = await usersCollection.insertOne(user);
      res.status(201).send(result);
    });

    // ✅ GET user role by email
    app.get('/users/:email/role', async (req, res) => {
      const email = req.params.email;
      try {
        const user = await usersCollection.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "User not found", role: 'customer' });
        }
        res.json({ role: user.role || 'customer' });
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // ✅ GET all policies
    app.get('/policies', async (req, res) => {
      try {
        const policies = await policiesCollection.find().toArray();
        res.send(policies);
      } catch (err) {
        res.status(500).send({ message: "Failed to fetch policies" });
      }
    });

    // ✅ POST a new policy (add purchaseCount default = 0)
    app.post('/policies', async (req, res) => {
      try {
        const newPolicy = { ...req.body, purchaseCount: 0 };
        const result = await policiesCollection.insertOne(newPolicy);
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to add policy" });
      }
    });

    // ✅ GET top 6 purchased policies
    app.get('/top-policies', async (req, res) => {
      try {
        const result = await policiesCollection
          .find()
          .sort({ purchaseCount: -1 })
          .limit(6)
          .toArray();
        res.send(result);
      } catch (error) {
        console.error("Error in /top-policies:", error);
        res.status(500).send({ message: "Failed to fetch top policies" });
      }
    });

    // ✅ Get specific policy by ID
    app.get('/policies/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const policy = await policiesCollection.findOne({ _id: new ObjectId(id) });
        if (!policy) {
          return res.status(404).send({ message: "Policy not found" });
        }
        res.send(policy);
      } catch (error) {
        res.status(400).send({ message: "Invalid Policy ID" });
      }
    });


app.put("/policy/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const result = await policiesCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: updatedData.title,
          category: updatedData.category,
          description: updatedData.description,
          minAge: updatedData.minAge,
          maxAge: updatedData.maxAge,
          coverageRange: updatedData.coverageRange,
          durationOptions: updatedData.durationOptions,
          basePremiumRate: updatedData.basePremiumRate,
          image: updatedData.image,
        },
      }
    );

    if (result.modifiedCount > 0) {
      res.send({ success: true, message: "Policy updated successfully" });
    } else {
      res.status(404).send({ success: false, message: "Policy not found or no changes" });
    }
  } catch (error) {
    console.error("Error updating policy:", error);
    res.status(500).send({ success: false, message: "Server error" });
  }
});


app.delete("/policiesDelete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await policiesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount > 0) {
      res.send({ success: true, message: "Policy deleted successfully" });
    } else {
      res.status(404).send({ success: false, message: "Policy not found" });
    }
  } catch (error) {
    console.error("Error deleting policy:", error);
    res.status(500).send({ success: false, message: "Server error" });
  }
});






    // ✅ PATCH user insurance application
    app.patch("/users/:email", async (req, res) => {
      const email = req.params.email;
      const updatedApplication = req.body.insuranceApplication;

      const result = await usersCollection.updateOne(
        { email: email },
        { $set: { insuranceApplication: updatedApplication } }
      );

      res.send(result);
    });
    app.get("/users", async (req, res) => {
  try {
    const users = await usersCollection.find().sort({ created_at: -1 }).toArray();
    res.send(users);
  } catch (err) {
    console.error("❌ Failed to fetch users:", err);
    res.status(500).send({ message: "Internal server error" });
  }
});



app.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.send({ success: true, user });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});




// update to the role
// ✅ Update user role by ID
const { ObjectId } = require('mongodb');

app.patch("/user/:id", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

console.log(id,role)

 
    const filter = { _id: new ObjectId(id) };
    const updateDoc = { $set: { role } };

    const result = await usersCollection.updateOne(filter, updateDoc);
      return res.send(result)

    
});


// delete users
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount > 0) {
      res.send({ success: true, message: "User deleted successfully" });
    } else {
      res.status(404).send({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.error("Failed to delete user:", err);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});



    // ✅ POST quote
    app.post('/quotes', async (req, res) => {
      const AllQuotes = {
        ...req.body,
        createdAt: new Date()
      };
      const result = await quoteCollection.insertOne(AllQuotes);
      res.send(result);
    });

    // ✅ GET latest quote by email
    app.get("/quotes", async (req, res) => {
      const email = req.query.email;
      console.log(email)

      if (!email) {
        return res.status(400).send({ message: "Email is required" });
      }

      const result = await quoteCollection
        .find({ userEmail:email })
        .sort({ createdAt: -1 })
        .limit(1)
        .toArray();

      if (!result.length) {
        return res.status(404).send({ message: "Quote not found" });
      }

      res.send(result[0]);
    });




    // post application data
    app.post("/applications", async (req, res) => {
  const application = req.body;
  const result = await ApplicationsCollection.insertOne(application);
  res.send(result);
});

// get application data by email
app.get("/application", async (req, res) => {
  const email = req.query.email;
  const result = await ApplicationsCollection.find({ userEmail: email }).toArray();
  res.send(result);
});

// ✅ GET all applications (for admin)
app.get("/applications", async (req, res) => {
  try {
    const result = await ApplicationsCollection.find().toArray();
    res.send(result);
  } catch (err) {
    console.error("Failed to fetch applications", err);
    res.status(500).send({ message: "Server error while fetching applications" });
  }
});


 app.patch("/applications/:id", async (req, res) => {
      const applicationId = req.params.id;

      try {
        const result = await ApplicationCollection.updateOne(
          { _id: new ObjectId(applicationId) },
          { $set: { reviewSubmitted: true } }
        );

        if (result.modifiedCount > 0) {
          res.send({ success: true, message: "Review marked as submitted." });
        } else {
          res.status(404).send({ success: false, message: "Application not found or already updated." });
        }
      } catch (err) {
        console.error("Error updating reviewSubmitted:", err);
        res.status(500).send({ success: false, message: "Server error" });
      }
    });
app.patch("/applications/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await ApplicationsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status } }
  );

  res.send(result);
});

// review of customer post api 
  app.post("/reviews", async (req, res) => {
      try {
        const review = req.body;

        // Basic validation
        if (!review.userEmail || !review.policyId || !review.rating || !review.comment) {
          return res.status(400).send({ message: "Missing required fields." });
        }

        // Optional: prevent duplicate reviews
        const existing = await reviewsCollection.findOne({
          userEmail: review.userEmail,
          policyId: review.policyId,
        });
        if (existing) {
          return res.status(400).send({ message: "Review already submitted." });
        }

        review.submittedAt = new Date();
        const result = await reviewsCollection.insertOne(review);
        res.send(result);
      } catch (error) {
        console.error("Error posting review:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    // ✅ GET All Reviews
    app.get("/reviews", async (req, res) => {
      const reviews = await reviewsCollection.find().sort({ submittedAt: -1 }).toArray();
      res.send(reviews);
    });






    console.log("✅ Connected to MongoDB & server routes ready");

  } catch (error) {
    console.error("❌ Connection error:", error);
  }
}

run().catch(console.dir);

// Default route
app.get('/', (req, res) => {
  res.send('Life Sure server is running');
});

// Listen
app.listen(port, () => {
  console.log(`✅ Server listening on port ${port}`);
});
