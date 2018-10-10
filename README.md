# CS2102_project

## Setup

#### Requirements:
- `npm`
- `pgsql` (>= 9.1)

#### Instructions
- Create a local pgsql database using `psql` CLI tool:
  - `CREATE DATABASE <db_name>`
  - `\c <db_name>`
  - `\conninfo` to get port number (default 5432)
  - `\password` to set password of a <user>
- Create a copy of `configTemplate.js`, `config.js`, and fill in database details
- `npm install` to install server dependencies
- `npm run start` to start server
