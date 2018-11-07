// Updates all the bids in the bid table to be unsuccessful if they are overdue
const updateBidsToUnsuccessfulIfOverdue = db => {
  return db
    .any('SELECT update_overdue_bids();')
    .then(() => {
      // success, no console log as this would be triggered at a set interval;
    })
    .catch(error => {
      console.log(error)
      // error;
    })
}

module.exports = {
  updateBidsToUnsuccessfulIfOverdue,
}
