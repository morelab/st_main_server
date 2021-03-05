<!-- @format -->

# Sentient Things main server

## Description

REST API in charge of managing al the requests generated from the Sentient Things web page.

The API has been developed in TypeScript.

## Project structure

    ├───configuration -> Constants and configuration constants
    ├───controllers -> Request controllers
    ├───core
    │   ├───entities -> Database model entities
    │   ├───interactors -> Functionality logic
    │   └───repositories -> Interfaces to implement in other resources
    ├───dataSources -> External resources implementations (Databases, APIs...)
    ├───routes -> Router for the API
    │   ├───app -> Application routes
    │   ├───authentication -> Authentication routes
    │   └───users -> Users information routes
    ├───server -> Server initialization
    ├───shared -> Shared functionalities
    │   ├───entities -> Shared entities such as responses
    │   └───services -> Internal resources implementation
    │       ├───app -> Logic implementation
    │       └───authentication -> Authentication implementation
    └───utils -> Utilities files

## Git Hooks

Before a commit, the format will be applied to all the files and the tests will run. Some of the tests need database connection.
