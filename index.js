const express = require("express")
const cors = require('cors')
require('dotenv').config();
const URL = require("./models/url")
const app = express()
const PORT = 8002
const urlRoute = require("./routes/url")
const staticRoute = require("./routes/staticRouter")
const bodyParser = require('body-parser');
const {connectToMongoDB} = require("./connect")
const mongoURI = process.env.MONGO_URI
app.use(express.json())
app.use(cors({origin:"*"}))
// console.log(mongoURI)
connectToMongoDB(mongoURI)
.then(()=>console.log("connected to Mongo"))
.catch((err,data)=>console.log(err))
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/url",urlRoute);
app.use("/",staticRoute);



app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  try {
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

    if (entry) {
      res.redirect(entry.redirectURL);
    } else {
      res.status(404).send("URL not found"); // Handle the case when no entry is found
    }
  } catch (error) {
    console.error("Error fetching URL:", error);
    res.status(500).send("Internal Server Error"); // Handle database or other errors
  }
});


app.listen(PORT,()=>{console.log("server is runnnig at ",PORT)})