// Allows creation of usr account
const createUserAppAccount = async (
  userEmail,
  userContactNumber,
  userName,
  userPassword,
  db
) => {
  return db
    .none(
      `
        INSERT INTO appUserAccount(email, contactNumber, name, password) 
        VALUES(
            $1, 
            $2, 
            $3, 
            $4
        );`,
      [userEmail, userContactNumber, userName, userPassword]
    )
    .then(() => {
      console.log('Create user success!')
      // success;
    })
    .catch(error => {
      console.log(error)
      // error;
    })
}

// Lists out the names and emails of everyone in userAppAccounts
const listUserAppAccount = async db => {
  return db
    .any(
      `
        SELECT a.userID, a.contactNumber, a.name, a.email 
        FROM appUserAccount a;`
    )
    .then(result => {
      console.log(`List user success:\n ${JSON.stringify(result)}`)
      // success;
      return result
    })
    .catch(error => {
      console.log(error)
      // error;
    })
}

// Adds a car to a specific user
const addCarToUser = async (
  owner,
  licensePlate,
  carBrand,
  carModel,
  numSeats,
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
      [licensePlate, owner, carBrand, carModel, numSeats]
    )
    .then(() => {
      console.log('Add car success!')
      // success;
    })
    .catch(error => {
      console.log(error)
      // error;
    })
}

// Deletes a car froma a specific user
const delCarFromUser = async (
  licensePlate,
  db
) => {
  return db
    .none(
      `
        DELETE FROM userOwnsACar
        WHERE licensePlate = $1;
      `,
      [licensePlate]
    )
    .then(() => {
      console.log('Delete Car success!')
      // success;
    })
    .catch(error => {
      console.log(error)
      // error;
    })
}

// Deletes a user account
const delUserAcct = async (
  userID,
  db
) => {
  return db
    .none(
      `
        DELETE FROM bid
        WHERE bidder = $1 OR driver = $1;
        DELETE FROM advertisedCarRide
        WHERE driver = $1;
        DELETE FROM userOwnsACar
        WHERE owner = $1;
        DELETE FROM appUserAccount
        WHERE userId = $1;
      `,
      [userID]
    )
    .then(() => {
      console.log('Delete User success!')
      // success;
    })
    .catch(error => {
      console.log(error)
      // error;
    })
}

// listCarUserOwns(arg1, arg2).then((res) => ...) use case
// lists all the cars owned by a user
const listCarUserOwns = async (owner, db) => {
  return db
    .any(
      `
      SELECT c.licensePlate, c.carBrand, c.carModel 
      FROM userOwnsACar c 
      WHERE c.owner = $1;
    `,
      [owner]
    )
    .then(result => {
      console.log(`List car success\n:${result}`)
      // success;
      return result
    })
    .catch(error => {
      console.log(error)
      // error;
    })
}

const getValidUserid = (username, password, db) => {
  return db.any(
      `
      SELECT a.userID
      FROM appUserAccount a
      WHERE 
        a.email = $1 AND
        a.password = $2
      `
      ,
      [username, password]
  )
  .then(result => {
    console.log(`Successful login for userID: ${JSON.stringify(result)}`)
    return result
  })
  .catch(error => {
    console.log(error)
    return error
  })
}

module.exports = {
  createUserAppAccount,
  listUserAppAccount,
  addCarToUser,
  delUserAcct,
  listCarUserOwns,
  getValidUserid
}
