# spotshare-backend

REST API for the Spot Share application

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequesites
You need to have Node.js installed in your system in order to run the REST API. 

https://nodejs.org/en/

The application was developed in Node v8.12.0. You should not have to install this specific version in order for the application to function correctly. If your current version does not support this application, you might want to use Node Version Manager(NVM).

https://github.com/creationix/nvm

This repository has the .nvmrc for NVM if you need it.

### Installing

After cloning the repository, run the following to install the dependencies:
```
npm install
```
In order to manage migrations, you must install knex globally:
```
npm install knex -g
```

For local development, you must also apply migrations to a SQLite3 database. This is done by running:

```
knex migrate:latest
```

This will create the SQLite3 database with all the required data.

Once you've done this, you can startup the server by running:
```
npm start
```
## Development

This repository uses git-flow. For more information:
https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow

### Migrations

In order to manage migrations, you must install knex globally:
```
npm install knex -g
```

To create an empty migration:
```
knex migrate:make <migration-name>
```

To apply migrations:
```
knex migrate:latest
```

For more information, go to https://knexjs.org/#Migrations-CLI

## Testing

Not Determined

## Deployment

Not Determined

## Built With

* Hapi.js
* Glue
* Boom
* Joi
* Objection.js
* Blipp
* Hapi-Swagger

## Versioning

We use [SemVer](https://semver.org/) for versioning. For the versions available, see the tags on this repository.

## Authors

* Manuel A. Baez Gonzalez
* Alberto de Jesus Santiago


