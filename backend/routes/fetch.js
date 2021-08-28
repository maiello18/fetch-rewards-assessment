const express = require("express");
const router = express.Router();

const fetchController = require("../controllers/fetch");

//---------------------------------------- GET Endpoints ----------------------------------------

router.get("/users/:id/balances", function (req, res) {
  fetchController.getPayerPointBalances(req, res);
});

//-------------------------------------- END GET Endpoints --------------------------------------

//---------------------------------------- POST Endpoints ----------------------------------------

router.post("/users/:id/transaction", function (req, res) {
  fetchController.addTransaction(req, res);
});

//-------------------------------------- END POST Endpoints --------------------------------------

//---------------------------------------- PUT Endpoints ----------------------------------------

router.put("/users/:id/spend", function (req, res) {
  fetchController.spendPoints(req, res);
});

//-------------------------------------- END PUT Endpoints --------------------------------------

module.exports = router;
