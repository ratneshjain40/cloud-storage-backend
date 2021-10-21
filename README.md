<!-- Logo and Title -->
<h1 align="center">
    <img src="https://upload.wikimedia.org/wikipedia/commons/7/74/Googledrive_logo.svg" height=100>
    <br />
    Cloud Storage Backend
    <br />
    <img src="https://img.shields.io/github/languages/count/ratneshjain40/cloud-storage-backend">
    <img src="https://img.shields.io/github/contributors/ratneshjain40/cloud-storage-backend?style=flat-square"> 
</h1>

<!-- Description -->
<h4 align="center">
    Backend service for google drive clone built using Azure services by
    <a href="https://github.com/@ratneshjain40/">@ratneshjain40</a>
</h4>

---

<br />

> NOTE : Frontend For this app can be found at 👉 [@ArnavGuptaaa/google-drive-clone](https://github.com/ArnavGuptaaa/google-drive-clone)


<br />

## 📌How To Use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/ratneshjain40/cloud-storage-backend

# Go into the repository
$ cd cloud-storage-backend

# Install dependencies
$ npm install

# Run the app 
$ npm start
```

<br />

## 📌Environment Variables 

You will need the following environment variables in your ``.env`` file
```.env
DB_STRING=""
SECRET=""

COSMOSDB_USER = 
COSMOSDB_PASSWORD = ""
COSMOSDB_DBNAME = ""
COSMOSDB_HOST= ""
COSMOSDB_PORT=""

AZURE_STORAGE_CONNECTION_STRING=""
AZURE_STORAGE_ACCESS_KEY=""
```

<br />

## 📌API Endpoints

### 1. Auth
For all the auth endpoints passport.js local strategy is used. (Refer [passport.js](http://www.passportjs.org/docs/downloads/html/))
#### POST - /login
Takes username and password as parameters.
```js
const  customFields  = {
    usernameField: 'username',
    passwordField: 'password',
}
```
#### POST  - /register
Takes username, password and email as default parameters

#### GET - ./is-logged
Check if user is logged in

Returns - 
```js
res.json({
    "user": req.user.username,
    "email": req.user.email,
    "success": true,
});
```
<br />

## 📌Credits

This software uses the following open source packages:
- [Node.js](https://nodejs.org/)
- [Passport.js](http://www.passportjs.org/)
- [Azure SDK](https://github.com/Azure/azure-sdk-for-js)


<!-- Footer -->
<br />

<p align="center">
    Made with ❤️ by
    <a href="https://github.com/@ratneshjain40/">@ratneshjain40</a>
</p>


