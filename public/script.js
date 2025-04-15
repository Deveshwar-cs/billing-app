function addRow() {
  const row = document.createElement("tr")
  row.innerHTML = `
    <td><input class="item-name" /></td>
    <td><input class="item-qty" type="number" value="1" /></td>
    <td><input class="item-price" type="number" value="0" /></td>
    <td><span class="item-total">0</span></td>
  `
  document.querySelector("#itemTable tbody").appendChild(row)
}

document.addEventListener("input", updateTotals)

function updateTotals() {
  let subtotal = 0
  document.querySelectorAll("#itemTable tbody tr").forEach((row) => {
    const qty = parseFloat(row.querySelector(".item-qty").value) || 0
    const price = parseFloat(row.querySelector(".item-price").value) || 0
    const total = qty * price
    row.querySelector(".item-total").innerText = total.toFixed(2)
    subtotal += total
  })

  const discount = parseFloat(document.getElementById("discount").value) || 0
  const tax = subtotal * 0.18
  const grandTotal = subtotal + tax - discount

  document.getElementById("subtotal").innerText = subtotal.toFixed(2)
  document.getElementById("tax").innerText = tax.toFixed(2)
  document.getElementById("total").innerText = grandTotal.toFixed(2)
}

function generateBill() {
  // const customer = {
  //   name: document.getElementById("custName").value,
  //   phone: document.getElementById("custPhone").value,
  // }
  const customerName = document.getElementById("custName").value
  const customerContact = document.getElementById("custPhone").value
  const items = []
  document.querySelectorAll("#itemTable tbody tr").forEach((row) => {
    const name = row.querySelector(".item-name").value
    const qty = parseFloat(row.querySelector(".item-qty").value) || 0
    const price = parseFloat(row.querySelector(".item-price").value) || 0
    items.push({name, qty, price})
  })

  const bill = {
    customerName,
    customerContact,
    items,
    subtotal: parseFloat(document.getElementById("subtotal").innerText),
    tax: parseFloat(document.getElementById("tax").innerText),
    discount: parseFloat(document.getElementById("discount").value),
    total: parseFloat(document.getElementById("total").innerText),
  }

  fetch("/api/bill", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(bill),
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("output").innerText =
        "Bill Saved with ID: " + data.billNumber
    })
}
