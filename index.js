const express = require("express")
require('dotenv').config();
const URL = require("./models/url")
const app = express()
const PORT = 8001
const urlRoute = require("./routes/url")
const {connectToMongoDB} = require("./connect")
const mongoURI = process.env.MONGO_URI
app.use(express.json())

// console.log(mongoURI)
connectToMongoDB(mongoURI)
.then(()=>console.log("connected to Mongo"))
.catch((err,data)=>console.log(err))
app.use("/url",urlRoute);
app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      {
        shortId,
      },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      }
    );
    res.redirect(entry.redirectURL);
  });

app.listen(PORT,()=>{console.log("server is runnnig at ",PORT)})