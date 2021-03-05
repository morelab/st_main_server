<!-- @format -->

[![TypeScript version](https://img.shields.io/badge/TypeScript-4.1.5-%233178c6)](https://github.com/microsoft/TypeScript/releases/tag/v4.1.5)
[![Style](https://img.shields.io/badge/style-airbnb-%23F05B5F)](https://github.com/airbnb/javascript)
[![st_main_server CI](https://github.com/morelab/st_main_server/actions/workflows/node.js.yml/badge.svg)](https://github.com/morelab/st_main_server/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/morelab/st_main_server/branch/master/graph/badge.svg?token=7tDZMrZSeJ)](https://codecov.io/gh/morelab/st_main_server)

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
