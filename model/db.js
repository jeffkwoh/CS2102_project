const pgp = require('pg-promise')({
  // initialisation options.
})
const cn = require('../config/config.js')
const db = pgp(cn)
const user = require('./user.js')
const bid = require('./bid.js')
const ride = require('./ride.js')

/**
 * Initialises database, with all the necessary tables specified in the database
 * design of this application.
 */
async function initDb() {
  const query = `
  BEGIN;

  CREATE TABLE IF NOT EXISTS appUserAccount (
    userID SERIAL PRIMARY KEY,
    email VARCHAR(128) UNIQUE NOT NULL,
    contactNumber VARCHAR(15) NOT NULL,
    name VARCHAR(64) NOT NULL,
    password VARCHAR(32) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS userOwnsACar (
    licensePlate VARCHAR(10) PRIMARY KEY,
    owner INTEGER NOT NULL,
    carBrand VARCHAR (64) NOT NULL,
    carModel VARCHAR (64) NOT NULL,
    numSeats INTEGER NOT NULL CHECK (numSeats > 0),
    FOREIGN KEY (owner) REFERENCES appUserAccount(userID)
  );

  CREATE TABLE IF NOT EXISTS advertisedCarRide (
    driver INTEGER REFERENCES appUserAccount(userID),
    car VARCHAR(10) REFERENCES userOwnsAcar(licensePlate),
    date DATE NOT NULL,
    time TIME NOT NULL,
    origin VARCHAR(128) NOT NULL,
    destination VARCHAR(128) NOT NULL,
    PRIMARY KEY (driver, date, time, origin, destination)
  );

  CREATE TABLE IF NOT EXISTS bid (
    bidStatus CHAR(12) CHECK(bidStatus = 'pending' OR bidStatus ='unsuccessful'
      OR bidStatus = 'successful') NOT NULL,
    bidAmount DECIMAL(6,2) NOT NULL CHECK (bidAmount >= 0),
    bidder INTEGER NOT NULL,
    driver INTEGER NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    origin VARCHAR(128),
    destination VARCHAR(128),
    FOREIGN KEY(bidder) REFERENCES appUserAccount(userID),
    FOREIGN KEY(driver, date, time, origin, destination)
    REFERENCES advertisedCarRide(driver, date, time, origin, destination),
    PRIMARY KEY(bidder, driver, date, time, origin, destination)
  );

  COMMIT;`

  return db
  .none(query)
  .then(() => {
    // success;
    console.log('Initialised tables!')
  })
  .catch(error => {
    // error;
    console.log(error)
  })
}

/**
 * Creates all stored functions, triggers and assertions.
 */
async function createFunctionsAndTriggers() {
  const query = `
  BEGIN;
  
  CREATE OR REPLACE FUNCTION get_available_car_seats(givenDate DATE, 
													givenDriver INTEGER, 
													givenTime TIME, 
													givenOrigin VARCHAR, 
													givenDestination VARCHAR) 
													RETURNS INTEGER AS 
	$n_bid_success$				
	SELECT uCar.numSeats
	FROM advertisedCarRide aCar, userOwnsACar uCar
		WHERE aCar.date = givenDate
		AND aCar.driver = givenDriver
		AND aCar.time = givenTime
		AND aCar.origin = givenOrigin
		AND aCar.destination = givenDestination
		AND aCar.car = uCar.licensePlate;	
	$n_bid_success$ 
	LANGUAGE sql;
		
  CREATE OR REPLACE FUNCTION process_bid_success() RETURNS TRIGGER AS $bid_success$
    BEGIN
        --
        -- Update the rest of the pending bids to unsuccessful once the max amount of car rides has been reached.
        --
		
		IF (NEW.bidStatus = 'successful') THEN
			IF (
				(SELECT COUNT(*)
					FROM bid
					WHERE bidStatus = 'successful'
					AND driver = NEW.driver
					AND date = NEW.date
					AND time = NEW.time
					AND origin = NEW.origin
					AND destination = NEW.destination
				) 
					>= 
        get_available_car_seats(NEW.date, NEW.driver, NEW.time, NEW.origin, NEW.destination)
			) THEN
			
			UPDATE bid
			SET bidStatus = 'unsuccessful' 
			WHERE bidStatus = 'pending' 
			AND driver = NEW.driver
			AND date = NEW.date
			AND time = NEW.time
			AND origin = NEW.origin
			AND destination = NEW.destination;
			
			END IF;
		END IF;
		
        RETURN NULL; -- result is ignored since this is an AFTER trigger
    END;
    $bid_success$ 
    LANGUAGE plpgsql 
    VOLATILE
    PARALLEL UNSAFE;

  -- Trigger to ensure that once the max amount of available bids are made, the
  -- rest of the pending bids are automatically made unsuccessful.
  CREATE TRIGGER bid_success
    AFTER INSERT OR UPDATE ON bid
    FOR EACH ROW EXECUTE PROCEDURE process_bid_success();
	
	 CREATE OR REPLACE FUNCTION assert_number_of_bid_success() RETURNS TRIGGER AS $n_bid_success$
		BEGIN
			--
			-- Forces a rollback on the whole statement if it determines that it results in
			-- more successful bids than available seats for car rides.
			--

			IF ((SELECT MAX(c.num) FROM
				(SELECT COUNT(*) AS num
					FROM bid
					WHERE bidStatus = 'successful'
					AND driver = NEW.driver
					AND date = NEW.date
					AND time = NEW.time
					AND origin = NEW.origin
					AND destination = NEW.destination
				 GROUP BY date, time, origin, destination, driver
				) AS c)
					>
        get_available_car_seats(NEW.date, NEW.driver, NEW.time, NEW.origin, NEW.destination)
			) THEN

				RAISE EXCEPTION 'Number of successful car ride bids cannot except number of available car seats.';

			END IF;

			RETURN NULL; -- result is ignored since this is an AFTER trigger
		END;
	$n_bid_success$ LANGUAGE plpgsql;
 
  -- Trigger to ensure that once the max amount of available bids are made for a
  -- car ride, no more bids can be made successful for that car ride. 
  CREATE TRIGGER assert_number_of_successful_bids_not_more_than_number_of_seats
	AFTER INSERT OR UPDATE ON bid
		FOR EACH ROW EXECUTE PROCEDURE assert_number_of_bid_success();

  COMMIT;`

  return db
  .any(query)
  .then(() => {
    // success;
    console.log('Created functions, triggers and assertions!')
  })
  .catch(error => {
    // error;
    console.log(error)
  })
}

async function deinitDb() {
  const query = `
  BEGIN;

  DROP TABLE IF EXISTS bid;
  DROP TABLE IF EXISTS advertisedCarRide;
  DROP TABLE IF EXISTS userOwnsACar;
  DROP TABLE IF EXISTS appUserAccount;

  COMMIT;`

  return db
  .none(query)
  .then(() => {
    // success;
    console.log('Dropped all tables!')
  })
  .catch(error => {
    // error;
    console.log(error)
  })
}

async function populateDb() {
  await user.createUserAppAccount('one@a.com', '98765432', 'one', 'one', db)
  await user.createUserAppAccount('two@a.com', '88765432', 'two', 'two', db)
  await user.createUserAppAccount('thr@a.com', '78765432', 'thr', 'thr', db)
  await user.createUserAppAccount('fou@a.com', '68765432', 'fou', 'fou', db)
  await user.createUserAppAccount('fiv@a.com', '58765432', 'fiv', 'fiv', db)
  await user.createUserAppAccount('alpha@a.com', '98213212', 'six', 'six', db)
  await user.createUserAppAccount('bravo@a.com', '95513212', 'sev', 'sev', db)
  await user.createUserAppAccount('charlie@a.com', '94765432', 'eig', 'eig', db)
  await user.createUserAppAccount('delta@a.com', '93765432', 'nin', 'nin', db)
  await user.createUserAppAccount('echo@a.com', '92765432', 'ten', 'ten', db)
  await user.createUserAppAccount('foxtrot@a.com', '88565432', 'ele', 'ele', db)
  await user.createUserAppAccount('golf@a.com', '81165432', 'twe', 'twe', db)
  await user.createUserAppAccount('hotel@a.com', '81155432', 'thir', 'thir', db)
  await user.createUserAppAccount(
      'india@a.com',
      '82335432',
      'fourt',
      'fourt',
      db
  )
  await user.createUserAppAccount(
      'juliett@a.com',
      '82565432',
      'fivt',
      'fivt',
      db
  )
  await user.createUserAppAccount('kilo@a.com', '82869932', 'sixt', 'sixt', db)
  await user.createUserAppAccount(
      'lima@a.com',
      '82865432',
      'sevent',
      'sevent',
      db
  )
  await user.createUserAppAccount(
      'mike@a.com',
      '82135432',
      'eighteen',
      'eighteen',
      db
  )
  await user.createUserAppAccount(
      'november@a.com',
      '89005432',
      'ninet',
      'ninet',
      db
  )
  await user.createUserAppAccount(
      'oscar@a.com',
      '80754372',
      'twent',
      'twent',
      db
  )

  await user.addCarToUser('1', 'SAA0000A', 'BrandA', 'ModelA', '1', db)
  await user.addCarToUser('1', 'SAA1111A', 'BrandA', 'ModelA', '1', db)
  await user.addCarToUser('1', 'SAA2222A', 'BrandA', 'ModelA', '1', db)
  await user.addCarToUser('2', 'SBB0000B', 'BrandB', 'ModelB', '2', db)
  await user.addCarToUser('3', 'SCC0000C', 'BrandC', 'ModelC', '3', db)
  await user.addCarToUser('4', 'SDD0000D', 'BrandD', 'ModelD', '4', db)
  await user.addCarToUser('5', 'SEE0000D', 'BrandE', 'ModelE', '4', db)
  await user.addCarToUser('5', 'SFF0000D', 'BrandF', 'ModelF', '4', db)
  await user.addCarToUser('6', 'SGG0000D', 'BrandG', 'ModelG', '4', db)
  await user.addCarToUser('7', 'SHH0000D', 'BrandE', 'Mode2E', '4', db)
  await user.addCarToUser('7', 'SII0000D', 'BrandH', 'Mode1H', '4', db)
  await user.addCarToUser('7', 'SJJ0000D', 'BrandI', 'Mode1I', '4', db)
  await user.addCarToUser('8', 'SKK0000D', 'BrandJ', 'Mode1J', '4', db)
  await user.addCarToUser('10', 'SLL0000D', 'BrandK', 'ModelK', '4', db)
  await user.addCarToUser('11', 'SMM0000D', 'BrandL', 'ModelL', '4', db)
  await user.addCarToUser('12', 'SNN0000D', 'BrandM', 'ModelM', '4', db)
  await user.addCarToUser('13', 'SOO0000D', 'BrandN', 'ModelN', '4', db)
  await user.addCarToUser('14', 'SPP0000D', 'BrandO', 'Model0', '4', db)
  await user.addCarToUser('15', 'SQQ0000D', 'BrandP', 'ModelP', '4', db)
  await user.addCarToUser('16', 'SRR0000D', 'BrandQ', 'ModelQ', '4', db)
  await user.addCarToUser('18', 'SSS0000D', 'BrandR', 'ModelR', '4', db)
  await user.addCarToUser('18', 'STT0000D', 'BrandS', 'ModelS', '4', db)
  await user.addCarToUser('18', 'SUU0000D', 'BrandT', 'ModelT', '6', db)
  await user.addCarToUser('18', 'SVV0000D', 'BrandU', 'ModelU', '6', db)
  await user.addCarToUser('19', 'SWW0000D', 'BrandA', 'Mode2A', '6', db)

  await ride.advertiseCarRide(
      '1',
      'SAA0000A',
      '2010-01-20',
      '13:00:00',
      'PlaceA1',
      'PlaceA2',
      db
  )
  await ride.advertiseCarRide(
      '1',
      'SAA2222A',
      '2010-02-20',
      '14:00:00',
      'PlaceB1',
      'PlaceB2',
      db
  )
  await ride.advertiseCarRide(
      '2',
      'SBB0000B',
      '2010-03-20',
      '15:00:00',
      'PlaceC1',
      'PlaceC2',
      db
  )
    await ride.advertiseCarRide(
      '2',
      'SBB0000B',
      '2010-03-21',
      '15:00:00',
      'PlaceC3',
      'PlaceC4',
      db
  )
  await ride.advertiseCarRide(
      '4',
      'SDD0000D',
      '2010-04-20',
      '16:00:00',
      'PlaceD1',
      'PlaceD2',
      db
  )
  await ride.advertiseCarRide(
      '5',
      'SEE0000D',
      '2010-04-20',
      '13:00:00',
      'PlaceA1',
      'PlaceA2',
      db
  )
  await ride.advertiseCarRide(
      '6',
      'SGG0000D',
      '2010-04-20',
      '15:00:00',
      'PlaceB1',
      'PlaceA2',
      db
  )
  await ride.advertiseCarRide(
      '6',
      'SGG0000D',
      '2010-04-21',
      '17:00:00',
      'PlaceD1',
      'PlaceA2',
      db
  )
  await ride.advertiseCarRide(
      '6',
      'SGG0000D',
      '2010-04-22',
      '13:00:00',
      'PlaceC1',
      'PlaceA2',
      db
  )
  await ride.advertiseCarRide(
      '7',
      'SHH0000D',
      '2010-04-20',
      '14:00:00',
      'PlaceE9',
      'PlaceB3',
      db
  )
  await ride.advertiseCarRide(
      '8',
      'SKK0000D',
      '2010-04-20',
      '15:00:00',
      'PlaceA1',
      'PlaceB8',
      db
  )
  await ride.advertiseCarRide(
      '8',
      'SKK0000D',
      '2010-04-21',
      '18:00:00',
      'PlaceR1',
      'PlaceV2',
      db
  )
  await ride.advertiseCarRide(
      '8',
      'SKK0000D',
      '2010-04-22',
      '18:30:00',
      'PlaceE1',
      'PlaceB2',
      db
  )
  await ride.advertiseCarRide(
      '8',
      'SKK0000D',
      '2010-04-23',
      '14:00:00',
      'PlaceS1',
      'PlaceX2',
      db
  )
  await ride.advertiseCarRide(
      '8',
      'SKK0000D',
      '2010-04-24',
      '11:00:00',
      'PlaceA1',
      'PlaceC2',
      db
  )
  await ride.advertiseCarRide(
      '10',
      'SLL0000D',
      '2010-04-20',
      '09:00:00',
      'PlaceV1',
      'PlaceB2',
      db
  )
  await ride.advertiseCarRide(
      '11',
      'SMM0000D',
      '2010-04-20',
      '13:00:00',
      'PlaceV1',
      'PlaceA2',
      db
  )
  await ride.advertiseCarRide(
      '12',
      'SNN0000D',
      '2010-04-24',
      '13:00:00',
      'PlaceB1',
      'PlaceA2',
      db
  )
  await ride.advertiseCarRide(
      '13',
      'SOO0000D',
      '2010-01-24',
      '13:00:00',
      'PlaceA1',
      'PlaceA2',
      db
  )
  await ride.advertiseCarRide(
      '13',
      'SOO0000D',
      '2010-01-25',
      '13:00:00',
      'PlaceS1',
      'PlaceA2',
      db
  )
  await ride.advertiseCarRide(
      '13',
      'SOO0000D',
      '2010-01-26',
      '13:00:00',
      'PlaceT1',
      'PlaceA2',
      db
  )
  await ride.advertiseCarRide(
      '13',
      'SOO0000D',
      '2010-01-26',
      '13:30:00',
      'PlaceE1',
      'PlaceA5',
      db
  )
  await ride.advertiseCarRide(
      '13',
      'SOO0000D',
      '2010-01-26',
      '14:00:00',
      'PlaceR1',
      'PlaceG2',
      db
  )
  await ride.advertiseCarRide(
      '13',
      'SOO0000D',
      '2010-01-26',
      '14:30:00',
      'PlaceW1',
      'PlaceG2',
      db
  )
  await ride.advertiseCarRide(
      '13',
      'SOO0000D',
      '2010-01-26',
      '15:00:00',
      'PlaceD1',
      'PlaceF2',
      db
  )
  await ride.advertiseCarRide(
      '18',
      'STT0000D',
      '2010-04-25',
      '18:00:00',
      'PlaceD1',
      'PlaceH2',
      db
  )
  await ride.advertiseCarRide(
      '18',
      'STT0000D',
      '2010-03-20',
      '12:00:00',
      'PlaceN1',
      'PlaceH2',
      db
  )
  await ride.advertiseCarRide(
      '18',
      'SUU0000D',
      '2010-01-23',
      '19:00:00',
      'PlaceZ1',
      'PlaceS2',
      db
  )
  await ride.advertiseCarRide(
      '18',
      'SUU0000D',
      '2010-01-22',
      '16:00:00',
      'PlaceA1',
      'PlaceU2',
      db
  )
  await ride.advertiseCarRide(
      '18',
      'SVV0000D',
      '2010-01-10',
      '17:00:00',
      'PlaceS1',
      'PlaceY2',
      db
  )
  await ride.advertiseCarRide(
      '19',
      'SWW0000D',
      '2010-01-12',
      '16:00:00',
      'PlaceR5',
      'PlaceJ2',
      db
  )
  await ride.advertiseCarRide(
      '19',
      'SWW0000D',
      '2010-01-11',
      '15:00:00',
      'PlaceL1',
      'PlaceN3',
      db
  )
  await ride.advertiseCarRide(
      '19',
      'SWW0000D',
      '2010-01-11',
      '13:00:00',
      'PlaceB1',
      'PlaceB1',
      db
  )
  await ride.advertiseCarRide(
      '19',
      'SWW0000D',
      '2010-01-11',
      '19:00:00',
      'PlaceN1',
      'PlaceC1',
      db
  )
  await ride.advertiseCarRide(
      '19',
      'SWW0000D',
      '2010-01-12',
      '10:00:00',
      'PlaceE1',
      'PlaceD1',
      db
  )

  await bid.createUserBid(
      '3',
      '100',
      '1',
      '2010-01-20',
      '13:00:00',
      'PlaceA1',
      'PlaceA2',
      db
  )
  await bid.createUserBid(
      '4',
      '200',
      '1',
      '2010-01-20',
      '13:00:00',
      'PlaceA1',
      'PlaceA2',
      db
  )
  await bid.createUserBid(
      '1',
      '100',
      '2',
      '2010-03-20',
      '15:00:00',
      'PlaceC1',
      'PlaceC2',
      db
  )
  await bid.createUserBid(
      '5',
      '500',
      '1',
      '2010-01-20',
      '13:00:00',
      'PlaceA1',
      'PlaceA2',
      db
  )
  await bid.createUserBid(
      '5',
      '120',
      '2',
      '2010-03-20',
      '15:00:00',
      'PlaceC1',
      'PlaceC2',
      db
  )
  await bid.createUserBid(
      '5',
      '345',
      '4',
      '2010-04-20',
      '16:00:00',
      'PlaceD1',
      'PlaceD2',
      db
  )
  await bid.createUserBid(
      '7',
      '333',
      '13',
      '2010-01-26',
      '15:00:00',
      'PlaceD1',
      'PlaceF2',
      db
  )
  await bid.createUserBid(
      '8',
      '314',
      '13',
      '2010-01-26',
      '15:00:00',
      'PlaceD1',
      'PlaceF2',
      db
  )
  await bid.createUserBid(
      '9',
      '311',
      '13',
      '2010-01-26',
      '15:00:00',
      'PlaceD1',
      'PlaceF2',
      db
  )
  await bid.createUserBid(
      '10',
      '325',
      '13',
      '2010-01-26',
      '15:00:00',
      'PlaceD1',
      'PlaceF2',
      db
  )
  await bid.createUserBid(
      '1',
      '325',
      '13',
      '2010-01-26',
      '15:00:00',
      'PlaceD1',
      'PlaceF2',
      db
  )
  await bid.createUserBid(
      '2',
      '325',
      '13',
      '2010-01-26',
      '15:00:00',
      'PlaceD1',
      'PlaceF2',
      db
  )
  await bid.createUserBid(
      '3',
      '325',
      '13',
      '2010-01-26',
      '15:00:00',
      'PlaceD1',
      'PlaceF2',
      db
  )
  await bid.createUserBid(
      '11',
      '370',
      '13',
      '2010-01-26',
      '15:00:00',
      'PlaceD1',
      'PlaceF2',
      db
  )
  await bid.createUserBid(
      '12',
      '221',
      '13',
      '2010-01-26',
      '14:30:00',
      'PlaceW1',
      'PlaceG2',
      db
  )
  await bid.createUserBid(
      '12',
      '123',
      '13',
      '2010-01-26',
      '14:00:00',
      'PlaceR1',
      'PlaceG2',
      db
  )
  await bid.createUserBid(
      '12',
      '421',
      '13',
      '2010-01-26',
      '13:30:00',
      'PlaceE1',
      'PlaceA5',
      db
  )
  await bid.createUserBid(
      '12',
      '155',
      '13',
      '2010-01-24',
      '13:00:00',
      'PlaceA1',
      'PlaceA2',
      db
  )
  await bid.createUserBid(
      '14',
      '275',
      '19',
      '2010-01-12',
      '10:00:00',
      'PlaceE1',
      'PlaceD1',
      db
  )
  await bid.createUserBid(
      '14',
      '185',
      '19',
      '2010-01-11',
      '19:00:00',
      'PlaceN1',
      'PlaceC1',
      db
  )
  await bid.createUserBid(
      '14',
      '125',
      '19',
      '2010-01-11',
      '13:00:00',
      'PlaceB1',
      'PlaceB1',
      db
  )
  await bid.createUserBid(
      '15',
      '345',
      '19',
      '2010-01-11',
      '13:00:00',
      'PlaceB1',
      'PlaceB1',
      db
  )
  await bid.createUserBid(
      '15',
      '345',
      '18',
      '2010-04-25',
      '18:00:00',
      'PlaceD1',
      'PlaceH2',
      db
  )
  await bid.createUserBid(
      '15',
      '345',
      '18',
      '2010-01-10',
      '17:00:00',
      'PlaceS1',
      'PlaceY2',
      db
  )
  await bid.createUserBid(
      '16',
      '365',
      '19',
      '2010-01-12',
      '10:00:00',
      'PlaceE1',
      'PlaceD1',
      db
  )
  await bid.createUserBid(
      '16',
      '123',
      '2',
      '2010-03-20',
      '15:00:00',
      'PlaceC1',
      'PlaceC2',
      db
  )
  await bid.createUserBid(
      '17',
      '352',
      '19',
      '2010-01-12',
      '10:00:00',
      'PlaceE1',
      'PlaceD1',
      db
  )
  await bid.createUserBid(
      '18',
      '300',
      '19',
      '2010-01-12',
      '10:00:00',
      'PlaceE1',
      'PlaceD1',
      db
  )
  await bid.createUserBid(
      '19',
      '250',
      '18',
      '2010-01-22',
      '16:00:00',
      'PlaceA1',
      'PlaceU2',
      db
  )
  await bid.createUserBid(
      '19',
      '123',
      '18',
      '2010-01-10',
      '17:00:00',
      'PlaceS1',
      'PlaceY2',
      db
  )

  await bid.updateBidStatus(
      '16',
      '2',
      '2010-03-20',
      '15:00:00',
      'PlaceC1',
      'PlaceC2',
      db
  )

  console.log('Populated all tables!')
}

/* DB helpers to be exported */
module.exports = {
  initDb,
  createFunctionsAndTriggers,
  deinitDb,
  populateDb,
  user,
  bid,
  ride,
  exposedInstance: db,
}
