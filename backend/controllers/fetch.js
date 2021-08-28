const fetchService = require("../services/fetch");

////////////////////////////////////////////////////////////
// Function: addTransaction
//
// Notes: Adds transactions for a specific payer and date
//        to a user's 'account'. Calls the fetch service
//        do the work.
////////////////////////////////////////////////////////////
const addTransaction = async (req, res) => {
  // Grab JSON transaction object, user id from the request
  const transactionJSON = req.body;
  const id = req.params.id;

  // Attempt to call the fetch service to do work
  try {
    let addTransactionResponse = await fetchService.addTransaction(
      id,
      transactionJSON
    );

    if (!JSON.stringify(addTransactionResponse).includes("Error")) {
      res.status(201).json(addTransactionResponse);
    } else {
      res.status(500).json(addTransactionResponse);
    }
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
};

////////////////////////////////////////////////////////////
// Function: spendPoints
//
// Notes: Spends user's points. Calls the fetch service
//        to do the work.
////////////////////////////////////////////////////////////
const spendPoints = async (req, res) => {
  // Grab JSON points object, user id from the request
  const pointsJSON = req.body;
  const id = req.params.id;

  // Attempt to call the fetch service to do work
  try {
    let spendPointsResponse = await fetchService.spendPoints(id, pointsJSON);

    if (!JSON.stringify(spendPointsResponse).includes("Error")) {
      res.status(201).json(spendPointsResponse);
    } else {
      res.status(500).json(spendPointsResponse);
    }
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
};

////////////////////////////////////////////////////////////
// Function: getPayerPointBalances
//
// Notes: Returns all payer point balances for the given
//        user. Calls the fetch service to do the work.
////////////////////////////////////////////////////////////
const getPayerPointBalances = async (req, res) => {
  // Grab user id from the request parameters
  const id = req.params.id;

  // Attempt to call the fetch service to do work
  try {
    const payerPointBalances = await fetchService.getPayerPointBalances(id);

    if (!JSON.stringify(payerPointBalances).includes("Error")) {
      res.status(200).json(payerPointBalances);
    } else {
      res.status(404).json(payerPointBalances);
    }
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
};

module.exports = {
  addTransaction,
  spendPoints,
  getPayerPointBalances,
};
