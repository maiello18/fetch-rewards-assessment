// In memory database
var database = new Map();

////////////////////////////////////////////////////////////
// Function: DEBUG_PRINT_MAP
//
// Notes: Utility helper function to print a map.
//        Debug purposes.
////////////////////////////////////////////////////////////
const DEBUG_PRINT_MAP = (map) => {
  console.log("Printing Map");
  console.log("=============================================================");
  map.forEach((v, k) => {
    console.log("Key: " + k);
    console.log("Value:");
    console.log(v);
    console.log("");
  });
  console.log("=============================================================");
  console.log("End Printing Map");
};

////////////////////////////////////////////////////////////
// Function: totalPayerPoints
//
// Notes: Function finds the total points for a given
//        payer in a user data store.
////////////////////////////////////////////////////////////
const totalPayerPoints = (id, payer) => {
  let userData = database.get(id);
  let totalPoints = 0;

  // Iterate transaction history and find the total points
  // for the payer
  userData.forEach((transaction) => {
    if (transaction.payer == payer) {
      totalPoints += transaction.points;
    }
  });

  return totalPoints;
};

////////////////////////////////////////////////////////////
// Function: totalPoints
//
// Notes: Function finds the total points for all payers.
////////////////////////////////////////////////////////////
const totalPoints = (id) => {
  let userData = database.get(id);
  let totalPoints = 0;

  // Iterate transaction history and find the total points
  userData.forEach((transaction) => {
    totalPoints += transaction.points;
  });

  return totalPoints;
};

////////////////////////////////////////////////////////////
// Function: safeTransaction
//
// Notes: Function determines if a given transaction would
//        overdraft a point balance (make it go negative).
////////////////////////////////////////////////////////////
const safeTransaction = (id, transaction) => {
  let safe = true;

  if (totalPayerPoints(id, transaction.payer) + transaction.points < 0) {
    safe = false;
  }

  return safe;
};

////////////////////////////////////////////////////////////
// Function: addTransaction
//
// Notes: Adds transactions for a specific payer and date
//        to a user's 'account'.
////////////////////////////////////////////////////////////
const addTransaction = async (id, transaction) => {
  let returnJSON = {};

  // Update the database with the new transaction
  try {
    // Check if user exists
    if (!database.has(id)) {
      database.set(id, []);
    }

    // Grab the user's data
    let userData = database.get(id);

    // Check if this transaction would 'overdraft' the payer balance
    if (safeTransaction(id, transaction)) {
      // Check if this is essentially a withdrawl or deposit
      let used = false;
      if (transaction.points < 0) {
        // It is a negative point which means it is an implicit 'spend'
        // for an explict payer. Attempt to 'spend' the points using
        // only payer related transactions
        spendPayerPoints(id, transaction.payer, transaction.points);
        used = true;
      }

      // Create new transaction object
      let newTransaction = {
        payer: transaction.payer,
        points: transaction.points,
        timestamp: new Date(transaction.timestamp),
        used: used,
      };

      // Update the user data store
      userData.push(newTransaction);

      // Update operation success flag
      successfullyAddedTransaction = true;

      returnJSON = {
        Status:
          "Success - The new transaction points " +
          transaction.points +
          " for payer " +
          transaction.payer +
          " were added to transaction history for user with id " +
          id +
          ".",
      };
    } else {
      returnJSON = {
        Status:
          "Error - The new transaction points " +
          transaction.points +
          " for payer " +
          transaction.payer +
          " would amount in an overdraft. Transaction will not be added.",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }

  return returnJSON;
};

////////////////////////////////////////////////////////////
// Function: spendPayerPoints
//
// Notes: Spends specific amount of points from a specifc
//        payer.
//
// Constraints:  We want the oldest points to be spent
//               first (oldest based on transaction timestamp,
//               not the order they’re received)
//
//               We want no payer's points to go negative
//
////////////////////////////////////////////////////////////
const spendPayerPoints = async (id, payer, points) => {
  // Grab the user data
  let userData = database.get(id);
  let pointsToSpend = Math.abs(points);

  // Sort user data
  userData.sort(function (a, b) {
    return a.timestamp.getTime() - b.timestamp.getTime();
  });

  userData.forEach((transaction) => {
    if (pointsToSpend == 0) {
      return;
    }

    // Check if the transaction has not been used
    // and that it is a transaction related to the payer
    if (!transaction.used && transaction.payer == payer) {
      // Check if it would be a safe transaction
      if (pointsToSpend <= transaction.points) {
        transaction.points -= pointsToSpend;
        pointsToSpend = 0;
      }
      // Check if the points to spend are more than the current transaction's points
      // If so we can still use up this transaction's points completely
      else if (pointsToSpend > transaction.points) {
        pointsToSpend -= transaction.points;
        transaction.points = 0;
      }

      // Updated the used flag
      if (transaction.points == 0) {
        transaction.used = true;
      }
    }
  });
};

////////////////////////////////////////////////////////////
// Function: spendPoints
//
// Notes: Spends user's points.
//
// Constraints:  We want the oldest points to be spent
//               first (oldest based on transaction timestamp,
//               not the order they’re received)
//
//               We want no payer's points to go negative
//
// Returns: Returns a list of { "payer": <string>,
//                              "points": <integer> }
////////////////////////////////////////////////////////////
const spendPoints = async (id, pointsJSON) => {
  let returnArray = [];
  let pointsToSpend = pointsJSON.points;

  if (database.has(id)) {
    // Check if the user even has enough points
    if (pointsToSpend > totalPoints(id)) {
      returnArray.push({
        Status:
          "Error - Attempting to spend " +
          pointsToSpend +
          " points for payer id " +
          id +
          " would amount in an overdraft. Transaction will stop processing.",
      });

      return returnArray;
    }

    // Grab the user data
    let userData = database.get(id);

    // Sort user data
    userData.sort(function (a, b) {
      return a.timestamp.getTime() - b.timestamp.getTime();
    });

    // Now that the transactions have been sorted, we can iterate
    // the array and spend points given two conditions
    // 1. Where the transaction hasn't been 'used'
    // 2. Where the spend wouldn't overdraft the point balance for
    //    the given payer
    let payerPointDifferences = new Map();

    userData.forEach((transaction) => {
      if (pointsToSpend == 0) {
        return;
      } // Check if the transaction has not been used
      if (!transaction.used) {
        // Grab the payers total point balance
        let payerPointTotal = totalPayerPoints(id, transaction.payer);
        let pointsToSpendPrior = pointsToSpend;

        // Check if it would be a safe transaction
        if (pointsToSpend <= transaction.points) {
          payerPointDifferences.set(
            transaction.payer,
            payerPointDifferences.get(transaction.payer) == undefined
              ? pointsToSpendPrior * -1
              : payerPointDifferences.get(transaction.payer) -
                  pointsToSpendPrior
          );

          transaction.points -= pointsToSpend;
          pointsToSpend = 0;
        }
        // Check if the points to spend are more than the current transaction's points
        // If so we can still use up this transaction's points completely
        else if (pointsToSpend > transaction.points) {
          payerPointDifferences.set(
            transaction.payer,
            payerPointDifferences.get(transaction.payer) == undefined
              ? transaction.points * -1
              : payerPointDifferences.get(transaction.payer) -
                  transaction.points
          );

          pointsToSpend -= transaction.points;
          transaction.points = 0;
        }

        // Updated the used flag
        if (transaction.points == 0) {
          transaction.used = true;
        }
      }
    });

    // Fill in the response JSON
    payerPointDifferences.forEach((value, key) => {
      returnArray.push({ payer: key, points: value });
    });
  } else {
    returnArray.push({
      Status:
        "Error - No user exists with the id " +
        id +
        ". Try calling the 'Add Transactions' route first to populate the database with that user",
    });
  }

  return returnArray;
};

////////////////////////////////////////////////////////////
// Function: getPayerPointBalances
//
// Notes: Returns all payer point balances for the given
//        user.
////////////////////////////////////////////////////////////
const getPayerPointBalances = async (id) => {
  let returnJSON = {};

  // Update the database with the new transaction
  try {
    // Check if user exists
    if (database.has(id)) {
      // Grab the user's data
      let userData = database.get(id);

      // Set up new point total map
      let payerPointTotals = new Map();

      // Iterate over the user data, and populate the payerPointTotals object
      userData.forEach((transaction) => {
        // Only count non negative transactions
        if (transaction.points >= 0) {
          payerPointTotals.set(
            transaction.payer,
            payerPointTotals.get(transaction.payer) == undefined
              ? transaction.points
              : payerPointTotals.get(transaction.payer) + transaction.points
          );
        }
      });

      // Fill in the response JSON
      payerPointTotals.forEach((value, key) => {
        returnJSON[key] = value;
      });
    } else {
      returnJSON = {
        Status:
          "Error - No user exists with the id " +
          id +
          ". Try calling the 'Add Transactions' route first to populate the database with that user",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }

  return returnJSON;
};

module.exports = {
  addTransaction,
  spendPoints,
  getPayerPointBalances,
};
