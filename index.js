const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w7djr5h.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    //Database Collection
    const studentInformationCollection = client
      .db("sabujGlobalDB")
      .collection("studentInfo");
    const blogCollection = client.db("sabujGlobalDB").collection("blogs");

    app.post("/post-student-info", async (req, res) => {
      const studentInfo = req.body;
      const result = await studentInformationCollection.insertOne(studentInfo);
      res.send(result);
    });

    app.get("/all-students", async (req, res) => {
      const result = await studentInformationCollection.find().toArray();
      res.send(result);
    });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    app.get("/all-blogs", async (req, res) => {
      const result = await blogCollection.find().toArray();
      res.send(result);
    });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Sabuj Global Server is available");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
