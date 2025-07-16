require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const stripe = require('stripe')(process.env.PAYMENT_GATEWAY);
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// middleWear
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log('Token in middleware:', token);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  
//  Verify JWT here with jwt.verify()
jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decode)=>{
  if(err){
     return res.status(401).json({ message: 'Unauthorized' });
  }
  console.log(decode)
  req.decoded = decode;
  next()
})

};

// Middleware: Only allow Admins


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hq0xigy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Middleware



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
    const claimsCollection = database.collection("claims");
    const paymentCollection = database.collection('payments')
    const subscribersCollection = database.collection('subscribe')


const verifyAdmin = async (req, res, next) => {
  const userEmail = req.decoded?.email;
  const user = await usersCollection.findOne({ email: userEmail });
 console.log('role',user?.role)
  if (user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }

  next();
};

// Middleware: Only allow Agents
const verifyAgent = async (req, res, next) => {
  const userEmail = req.decoded?.email;
  const user = await usersCollection.findOne({ email: userEmail });
 console.log('role',user?.role)
  if (user?.role !== 'agent') {
    return res.status(403).json({ message: 'Forbidden: Agents only' });
  }

  next();
};

const verifyAdminOrAgent = (req, res, next) => {
  const role = req.decoded?.role;
  console.log(role)
   if (!role || !["agent" ,"admin"].includes(role)) {
        return res.status(403).send({ message: "forbidden access" });
      }
  next();
};







    // ✅ POST user
    app.post('/users', verifyToken, async (req, res) => {
      const user = req.body;
      const existingUser = await usersCollection.findOne({ email: user.email });
      if (existingUser) {
        return res.status(409).send({ message: "User already exists" });
      }
      const result = await usersCollection.insertOne(user);
      res.status(201).send(result);
    });

    // ✅ GET user role by email
    app.get('/users/:email/role',verifyToken, async (req, res) => {
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
app.patch("/users/:id",verifyToken,verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, photo } = req.body;
  console.log(name,photo)

  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // If both name and photo are unchanged, return early
    if (user.name === name && user.photo === photo) {
      return res.send({ modifiedCount: 0, message: "No changes made" });
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, photo } }
    );

    res.send({ modifiedCount: result.modifiedCount, message: "Updated" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({ message: "Update failed" });
  }
});

    // GET a single user by email
app.get("/user/:email", verifyToken,async (req, res) => {
  const email = req.params.email;
if(req.decoded.email !== email){
  res.status(403).send({message:'Forbidden Access'})
}
  try {
    const user = await usersCollection.findOne({ email });
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send({ message: "Internal server error" });
  }
});




// jwt related api
app.post('/jwt', async (req, res) => {
  const userData = req.body;
  const token = jwt.sign(userData, process.env.JWT_SECRET_KEY, { expiresIn: '8h' });
 console.log(token)
  res
    .cookie('token', token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'lax',
    })
    .send({ success: true },token); 
});







    // ✅ GET all policies
app.get("/policies", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const category = req.query.category;
  const search = req.query.search;

  const query = {};

  if (category) {
    query.category = category;
  }

  if (search) {
    query.title = { $regex: search, $options: "i" }; // Case-insensitive regex
  }

  try {
    const total = await policiesCollection.countDocuments(query);
    const policies = await policiesCollection
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    res.send({ total, policies });
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch policies" });
  }
});

    app.get('/policy', async (req, res) => {
      try {
        const policies = await policiesCollection.find().toArray();
        res.send(policies);
      } catch (err) {
        res.status(500).send({ message: "Failed to fetch policies" });
      }
    });

// Get top 3 featured agents
app.get("/featured-agents", async (req, res) => {
  try {
    const agents = await usersCollection
      .find({ role: "agent" })
      .sort({ experience: -1 }) // Sort by experience (optional)
      .limit(3)
      .toArray();
    res.send(agents);
  } catch (err) {
    console.error("Error fetching agents:", err);
    res.status(500).send({ message: "Failed to fetch agents" });
  }
});


    // ✅ POST new policy
    app.post('/policies', verifyToken,verifyAdmin, async (req, res) => {
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
    app.put("/policy/:id", verifyToken,verifyAdmin, async (req, res) => {
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
app.patch("/policies/purchase/:id", verifyToken,verifyAgent, async (req, res) => {
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
    app.delete("/policiesDelete/:id", verifyToken,verifyAdmin, async (req, res) => {
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
    app.patch("/user/:id",verifyToken,verifyAdmin, async (req, res) => {
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
    app.delete("/users/:id",verifyToken,verifyAdmin, async (req, res) => {
      const { id } = req.params;
      try {
        const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to delete user" });
      }
    });

    // ✅ PATCH insurance application
    app.patch("/users/:email", verifyToken,verifyAdmin, async (req, res) => {
      const email = req.params.email;
      const updatedApplication = req.body.insuranceApplication;
      const result = await usersCollection.updateOne(
        { email },
        { $set: { insuranceApplication: updatedApplication } }
      );
      res.send(result);
    });

    // ✅ GET all users
    app.get("/users",verifyToken,verifyAdmin, async (req, res) => {
      try {
        const users = await usersCollection.find().sort({ created_at: -1 }).toArray();
        res.send(users);
      } catch (err) {
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // ✅ GET user by ID
    app.get("/users/:id",verifyToken,verifyAdmin, async (req, res) => {
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
    app.post('/quotes',verifyToken, async (req, res) => {
      const AllQuotes = { ...req.body, createdAt: new Date() };
      const result = await quoteCollection.insertOne(AllQuotes);
      res.send(result);
    });

    // ✅ GET quote by email
    app.get("/quotes", verifyToken, async (req, res) => {
      const email = req.query.email;
      if(req.decoded.email !== email){
        return res.status(403).send({ message: "Forbidden: Access denied" });
      }
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
    app.post("/applications",verifyToken , async (req, res) => {
      const application = req.body;
      const result = await ApplicationsCollection.insertOne(application);
      res.send(result);
    });

    // ✅ GET applications by email(user)
   app.get("/application",verifyToken, async (req, res) => {
      const email = req.query.email;
      const result = await ApplicationsCollection.find({ userEmail: email }).toArray();
      res.send(result);
    });

    //    app.get("/applicationAGent", verifyToken,verifyAgent, async (req, res) => {
    //   const email = req.query.assignedAgent;
    //   const result = await ApplicationsCollection.find({ userEmail: email }).toArray();
    //   res.send(result);
    // });


    // ✅ GET all applications (agent)
    app.get("/applications",verifyToken,verifyAgent,  async (req, res) => {
      const email = req.query.assignedAgent;
       
      try {
        const result = await ApplicationsCollection.find({assignedAgent:email}).toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Server error while fetching applications" });
      }
    });


      app.get("/applicationsAdmin", verifyToken,verifyAdmin, async (req, res) => {
       
      try {
        const result = await ApplicationsCollection.find().toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Server error while fetching applications" });
      }
    });


    // ✅ PATCH application reviewSubmitted
 app.patch("/applications/:id",verifyToken,verifyAdmin, async (req, res) => {
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
    app.patch("/applications/:id/status", verifyToken,verifyAdmin, async (req, res) => {
      const { id } = req.params;
      const { status } = req.body;
      const result = await ApplicationsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
      );
      res.send(result);
    });






app.patch("/applicationStatus/:id",verifyToken,verifyAgent, async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const result = await ApplicationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server error" });
  }
});



app.get('/application/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const query = { _id: new ObjectId(id) };
    const application = await ApplicationsCollection.findOne(query);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (err) {
    console.error('Error fetching application:', err);
    res.status(500).json({ error: 'Server error' });
  }
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
    app.post("/blogs", verifyToken,verifyAdminOrAgent, async (req, res) => {
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


 app.get("/blogs/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await blogsCollection.findOne({ _id: new ObjectId(id) });
    if (!result) {
      return res.status(404).send({ message: "Blog not found" });
    }
    res.send(result);
  } catch (err) {
    console.error("Error fetching blog:", err);
    res.status(500).send({ message: "Failed to fetch blog" });
  }
});



  app.patch("/blogs/:id", verifyToken,verifyAdminOrAgent, async (req, res) => {
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

   app.delete("/blogs/:id",verifyToken,verifyAdminOrAgent, async (req, res) => {
    const blogId = req.params.id;
    try {
      const result = await blogsCollection.deleteOne({ _id: new ObjectId(blogId) });
      res.send(result);
    } catch (err) {
      console.error("Blog delete error:", err);
      res.status(500).send({ message: "Failed to delete blog" });
    }
  });





  // claims 

app.get("/claims",verifyToken, async (req, res) => {
      try {
        const userEmail = req.query.userEmail;
        const query = userEmail ? { userEmail } : {};
        const result = await claimsCollection.find(query).toArray();
        res.json(result);
      } catch (error) {
        console.error("Error fetching claims:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.get("/my-approved-applications", verifyToken, async (req, res) => {
  const email = req.query.email;

  if (!email || req.decoded.email !== email) {
    return res.status(403).send({ message: "Forbidden Access" });
  }

  try {
    const approvedApps = await ApplicationsCollection
      .find({ userEmail: email, status: "Approved" })
      .toArray();

    res.send(approvedApps);
  } catch (error) {
    console.error("Error fetching approved applications:", error);
    res.status(500).send({ message: "Server Error" });
  }
});



app.post("/claims", verifyToken, async (req, res) => {
      try {
        const claim = req.body;

        // Basic validation
        if (
          !claim.policyId ||
          !claim.policyTitle ||
          !claim.userEmail ||
          !claim.reason ||
          !claim.documentUrl
        ) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        claim.status = "Pending";
        claim.submittedAt = new Date();

        const result = await claimsCollection.insertOne(claim);
        res.json({ insertedId: result.insertedId });
      } catch (error) {
        console.error("Error submitting claim:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

 app.patch("/claims/:id", verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        const { status } = req.body;

        if (!status) return res.status(400).json({ message: "Status is required" });

        const result = await claimsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status } }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Claim not found" });
        }

        res.json({ message: "Claim status updated" });
      } catch (error) {
        console.error("Error updating claim:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

  app.patch("/claims/status/:id",verifyToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await claimsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );
    res.send(result);
  } catch (err) {
    console.error("Failed to update claim status", err);
    res.status(500).send({ message: "Server error" });
  }
});


// set status as due
app.patch("/applicationPaymentStatus/:id", verifyToken,verifyAgent, async (req, res) => {
  const appId = req.params.id;
  const { paymentStatus } = req.body;

  if (!paymentStatus) {
    return res.status(400).send({ error: "paymentStatus is required" });
  }

  try {
    

    const result = await ApplicationsCollection.updateOne(
      { _id: new ObjectId(appId) },
      { $set: { paymentStatus } }
    );

    if (result.modifiedCount > 0) {
      res.send({ message: "Payment status updated successfully" });
    } else {
      res.status(404).send({ error: "Application not found or already up to date" });
    }
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});


app.get("/approvedApplications",verifyToken, async (req, res) => {
  const userEmail = req.query.email;
  const paymentStatus = req.query.paymentStatus; // optional

  if (!userEmail) {
    return res.status(400).send({ error: "User email is required" });
  }

  try {
    const query = {
      userEmail: userEmail,
      status: "Approved",
    };

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    const result = await ApplicationsCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching approved applications:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});


// payment api
app.post("/create-payment-intent", verifyToken, async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"]
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).send({ error: "Stripe payment intent failed" });
  }
});

app.patch("/applications/:id/markPaid",verifyToken, async (req, res) => {
  const id = req.params.id;
  const result = await ApplicationsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { paymentStatus: "paid" } }
  );
  res.send(result);
});

app.post("/payments",verifyToken, async (req, res) => {
  const payment = req.body;
  const result = await paymentCollection.insertOne(payment);
  res.send(result);
});

app.get('/payments', verifyToken, async (req, res) => {
  try {
    const db = req.app.locals.db; 
    const { email, policy, from, to } = req.query;

    const query = {};

    if (email) {
      query.email = email;
    }

    if (policy) {
      query.policyTitle = policy;
    }

    if (from && to) {
      query.date = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    const payments = await paymentCollection
      .find(query)
      .sort({ date: -1 })
      .toArray();

    res.status(200).json(payments);
  } catch (error) {
    console.error('Failed to get payments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post("/subscribers", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).send({ message: "Name and Email required" });
  }

  try {
    const result = await subscribersCollection.insertOne({
      name,
      email,
      subscribedAt: new Date(),
    });
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Failed to subscribe" });
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
