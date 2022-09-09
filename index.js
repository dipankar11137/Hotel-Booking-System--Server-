const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kej55ts.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const hotelCollection = client.db("hotel-booking").collection("hotels");

    // hotels
    app.post("/hotels", async (req, res) => {
      const newHotel = req.body;
      const result = await hotelCollection.insertOne(newHotel);
      res.send(result);
    });
    app.put("/hotels/:id", async (req, res) => {
      const id = req.params.id;
      const updateNow = req.body;
      const updateHotel = await hotelCollection.findByIdAndUpdate(
        id,
        {
          $set: updateNow,
        },
        { new: true }
      );
      res.send(updateHotel);
    });

    app.delete("/hotels/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await hotelCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/hotels/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await hotelCollection.findOne(query);
      res.send(result);
    });
    app.get("/hotels", async (req, res) => {
      const query = {};
      const cursor = hotelCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // app.get("/home", async (req, res) => {
    //   res.send("Grt it");
    // });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Hotel Booking Server");
});

app.listen(port, () => {
  console.log("Hotel Booking is running ");
});
