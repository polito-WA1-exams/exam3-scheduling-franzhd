# Exam #12345: "Exam Title"
## Student: s123456 LASTNAME FIRSTNAME 

## React client application routes

- Route `/`: Redirect to login page
- Route `/login`: login page for both student and teacher
- ...

## REST API server

- POST `/api/login`
  - request parameters and request body content: for teacher contein teacher code and password, for student contein only the student code, server will understand the difference based on the first letter of the code.
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

## Server database

- Table `teacher` - contains code name surname course_name
- Table `student` - contains code name surname
- Table `something` - contains ww qq ss
- ...

## Main React Components

- `LoginForm` (in `App.js`): show the login conteiners and allow login
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Configurator Screenshot](./img/screenshot.jpg)

## Test users

* username, password
* username, password
* username, password (frequent customer)
* username, password
* username, password (frequent customer)
