// Allows the Adding of a car to the user
const addCarToUser = async (
  owner,
  licensePlate,
  carBrand,
  carModel,
  numAvailSeats,
  db
) => {
  return db
    .none(
      `
        INSERT INTO userOwnsACar(licensePlate, owner, carBrand, carModel, numSeats) 
        VALUES(
            $1, 
            $2, 
            $3, 
            $4,
            $5
        );`,
      [licensePlate, owner, carBrand, carModel, numAvailSeats]
    )
    .then(() => {
      console.log('Added the car to User')
      // success;
    })
    .catch(error => {
      console.log(error)
      // error;
    })
}

module.exports = {
  addCarToUser,
}
