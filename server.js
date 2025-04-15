const mongoose = require("mongoose")
mongoose
  .connect(
    "mongodb+srv://billing_user:yourpassword123@cluster0.kmcymft.mongodb.net/billingDB?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err))

const billSchema = new mongoose.Schema({
  customerName: String,
  customerContact: Number,
  items: Array,
  subtotal: Number,
  discount: Number,
  tax: Number,
  total: Number,
  billNumber: String,
  date: {type: Date, default: Date.now},
})

const Bill = mongoose.model("Bill", billSchema)

const express = require("express")
const app = express()
const PORT = 3000

app.use(express.static("public"))
app.use(express.json())

// ✅ New MongoDB-based route
app.post("/api/bill", async (req, res) => {
  try {
    const bill = req.body
    bill.billNumber = "INV-" + Date.now()
    bill.date = new Date()

    const newBill = new Bill(bill)
    await newBill.save()

    res.json({message: "✅ Bill saved!", billNumber: bill.billNumber})
  } catch (err) {
    console.error("❌ Failed to save bill:", err)
    res.status(500).json({message: "Error saving bill"})
  }
})

// 🆕 Get all bills
app.get("/api/bills", async (req, res) => {
  try {
    const bills = await Bill.find().sort({date: -1}) // latest first
    res.json(bills)
  } catch (err) {
    console.error("❌ Failed to fetch bills:", err)
    res.status(500).json({message: "Error retrieving bills"})
  }
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
