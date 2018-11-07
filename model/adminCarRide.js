//CREATE
const addACarRide = (driver, car, date, time, origin, dest, db) => {
  return db
  .none(`INSERT INTO advertisedCarRide (driver, car, date, time, origin, destination)
          VALUES ($1, $2, $3, $4, $5, $6);`,
      [driver, car, new Date(date), time, origin, dest])
  .then((result) => {
    return result
  })
  .catch(error => {
    console.log(error)
    return error;
  })
}

//READ
const getAllCarRides = (db) => {
  return db
  .any(`SELECT * FROM advertisedCarRide;`)
  .then((result) => {
    return result
  })
  .catch(error => {
    console.log(error)
    return error
  })
}

// UPDATE
const updateCarRide = (oldDriver, oldDate, oldTime, oldOrigin, oldDest,
                       newDriver, newCar, newDate, newTime, newOrigin, newDest, db) => {
  return db
  .none(`
      UPDATE advertisedCarRide
      SET 
      driver = $7,
      car = $8,
      date = $9,
      time = $10,
      origin = $11,
      destination = $12 
      WHERE driver = $1 AND
        car = $2 AND
        date = $3 AND
        time = $4 AND
        origin = $5 AND
        destination = $6
      `, [oldDriver, new Date(oldDate), oldTime, oldOrigin, oldDest,
  newDriver, newCar, new Date(newDate), newTime, newOrigin, newDest])
  .then(() => {
    // NONE doesn't return anything
    return
  })
  .catch(err => {
    console.log(err)
    return err
  })
}

// DELETE
const deleteCarRide = (driver, date, time, origin, dest, db) => {
  return db
  .none(`
      DELETE FROM advertisedCarRide
      WHERE driver = $1 AND
        car = $2 AND
        date = $3 AND
        time = $4 AND
        origin = $5 AND
        destination = $6
      `, [driver, new Date(date), time, origin, dest])
  .then(() => {
    // NONE doesn't return anything
    return
  })
  .catch(err => {
    console.log(err)
    return err
  })
}

module.exports = {
  addACarRide,
  getAllCarRides,
  updateCarRide,
  deleteCarRide
}
