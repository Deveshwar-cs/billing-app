
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/api/bill', (req, res) => {
  const bill = req.body;
  const billsFile = path.join(__dirname, 'bills.json');

  let bills = [];
  if (fs.existsSync(billsFile)) {
    bills = JSON.parse(fs.readFileSync(billsFile));
  }

  bill.billNumber = "INV-" + Date.now();
  bill.date = new Date().toISOString();
  bills.push(bill);
  fs.writeFileSync(billsFile, JSON.stringify(bills, null, 2));

  res.json({ message: "Bill saved!", billNumber: bill.billNumber });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
