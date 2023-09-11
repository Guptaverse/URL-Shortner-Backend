const express = require("express");
const URL = require("../models/url");
const {
  handleGenerateNewShortURL,
  handleGetAnalytics,

} = require("../controllers/url");

const router = express.Router();
router.get("/",(req,res)=>{
  res.end("Hello from backend!")
})
router.post("/", handleGenerateNewShortURL);

router.get("/analytics/:shortId", handleGetAnalytics);
router.delete("/:id",async (req,res)=>{
  const id = req.params.id;
  try {
    // Find the URL by its ID and remove it from the database
    await URL.findByIdAndDelete(id);
    
    res.status(204).end(); // Respond with a success status (204 No Content)
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.status(500).json({ error: "Error deleting URL" });
  }

})
module.exports = router;