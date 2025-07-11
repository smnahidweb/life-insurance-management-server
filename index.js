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
    const ApplicationsCollection = database.collection('application');
    const reviewsCollection = database.collection('reviews');
    const toBeAgentsCollection = database.collection('agentData');
    const blogsCollection = database.collection('blogs')

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

    // ✅ POST new policy
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
        res.status(500).send({ message: "Failed to fetch top policies" });
      }
    });

    // ✅ GET policy by ID
    app.get('/policies/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const policy = await policiesCollection.findOne({ _id: new ObjectId(id) });
        if (!policy) return res.status(404).send({ message: "Policy not found" });
        res.send(policy);
      } catch (error) {
        res.status(400).send({ message: "Invalid Policy ID" });
      }
    });

    // ✅ UPDATE policy
    app.put("/policy/:id", async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;
      try {
        const result = await policiesCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to update policy" });
      }
    });

// policy increment 

// Inside your Express router (e.g., policies.routes.js or similar)
app.patch("/policies/purchase/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await policiesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { purchaseCount: 1 } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Policy not found or update failed." });
    }

    res.json({ message: "Purchase count incremented." });
  } catch (error) {
    console.error("Error incrementing purchase count:", error);
    res.status(500).json({ message: "Failed to update purchase count." });
  }
});



    // ✅ DELETE policy
    app.delete("/policiesDelete/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const result = await policiesCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to delete policy" });
      }
    });

    // ✅ POST to-be-agent
    app.post("/to-be-agent", async (req, res) => {
      try {
        const result = await toBeAgentsCollection.insertOne(req.body);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    // ✅ GET all to-be-agents
    app.get("/to-be-agent", async (req, res) => {
      try {
        const agents = await toBeAgentsCollection.find().toArray();
        res.send(agents);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch agents" });
      }
    });

    // ✅ PATCH agent status
    app.patch("/to-be-agent/:id", async (req, res) => {
      const id = req.params.id;
      const { status } = req.body;
      try {
        const result = await toBeAgentsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status } }
        );
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: "Failed to update agent status" });
      }
    });

    // ✅ PATCH user role
    app.patch("/user/:id", async (req, res) => {
      const { id } = req.params;
      const { role } = req.body;
      try {
        const result = await usersCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { role } }
        );
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: "Failed to update user role" });
      }
    });

    // ✅ DELETE user
    app.delete("/users/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to delete user" });
      }
    });

    // ✅ PATCH insurance application
    app.patch("/users/:email", async (req, res) => {
      const email = req.params.email;
      const updatedApplication = req.body.insuranceApplication;
      const result = await usersCollection.updateOne(
        { email },
        { $set: { insuranceApplication: updatedApplication } }
      );
      res.send(result);
    });

    // ✅ GET all users
    app.get("/users", async (req, res) => {
      try {
        const users = await usersCollection.find().sort({ created_at: -1 }).toArray();
        res.send(users);
      } catch (err) {
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // ✅ GET user by ID
    app.get("/users/:id", async (req, res) => {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const user = await usersCollection.findOne({ _id: new ObjectId(id) });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.send({ success: true, user });
    });

    // ✅ POST quote
    app.post('/quotes', async (req, res) => {
      const AllQuotes = { ...req.body, createdAt: new Date() };
      const result = await quoteCollection.insertOne(AllQuotes);
      res.send(result);
    });

    // ✅ GET quote by email
    app.get("/quotes", async (req, res) => {
      const email = req.query.email;
      if (!email) {
        return res.status(400).send({ message: "Email is required" });
      }
      const result = await quoteCollection
        .find({ userEmail: email })
        .sort({ createdAt: -1 })
        .limit(1)
        .toArray();
      if (!result.length) {
        return res.status(404).send({ message: "Quote not found" });
      }
      res.send(result[0]);
    });

    // ✅ POST application
    app.post("/applications", async (req, res) => {
      const application = req.body;
      const result = await ApplicationsCollection.insertOne(application);
      res.send(result);
    });

    // ✅ GET applications by email
    app.get("/application", async (req, res) => {
      const email = req.query.email;
      const result = await ApplicationsCollection.find({ userEmail: email }).toArray();
      res.send(result);
    });

    // ✅ GET all applications
    app.get("/applications", async (req, res) => {
      try {
        const result = await ApplicationsCollection.find().toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Server error while fetching applications" });
      }
    });

    // ✅ PATCH application reviewSubmitted
 app.patch("/applications/:id", async (req, res) => {
  const { id } = req.params;
  const { assignedAgent } = req.body;

  try {
    const result = await ApplicationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { assignedAgent } }
    );
    res.send(result);
  } catch (error) {
    console.error("Failed to assign agent:", error);
    res.status(500).send({ message: "Failed to assign agent" });
  }
});

    // ✅ PATCH application status
    app.patch("/applications/:id/status", async (req, res) => {
      const { id } = req.params;
      const { status } = req.body;
      const result = await ApplicationsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
      );
      res.send(result);
    });

    // ✅ POST review
    app.post("/reviews", async (req, res) => {
      const review = req.body;
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
    });

    // ✅ GET all reviews
    app.get("/reviews", async (req, res) => {
      const reviews = await reviewsCollection.find().sort({ submittedAt: -1 }).toArray();
      res.send(reviews);
    });


    // post blogs
    app.post("/blogs", async (req, res) => {
  try {
    const blog = req.body;
    const result = await blogsCollection.insertOne(blog);
    res.send(result);
  } catch (err) {
    console.error("Error saving blog:", err);
    res.status(500).send({ message: "Failed to save blog" });
  }
});

 app.get("/blogs", async (req, res) => {
    try {
      const result = await blogsCollection.find().sort({ publishDate: -1 }).toArray();
      res.send(result);
    } catch (err) {
      res.status(500).send({ message: "Failed to fetch blogs" });
    }
  });


  app.patch("/blogs/:id", async (req, res) => {
    const blogId = req.params.id;
    try {
      const result = await blogsCollection.updateOne(
        { _id: new ObjectId(blogId) },
        { $set: { title: req.body.title, content: req.body.content } }
      );
      res.send(result);
    } catch (err) {
      console.error("Blog update error:", err);
      res.status(500).send({ message: "Failed to update blog" });
    }
  });

   app.delete("/blogs/:id", async (req, res) => {
    const blogId = req.params.id;
    try {
      const result = await blogsCollection.deleteOne({ _id: new ObjectId(blogId) });
      res.send(result);
    } catch (err) {
      console.error("Blog delete error:", err);
      res.status(500).send({ message: "Failed to delete blog" });
    }
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

app.listen(port, () => {
  console.log(`✅ Server listening on port ${port}`);
});
