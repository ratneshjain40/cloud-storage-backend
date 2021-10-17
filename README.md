# ENDPOINTS

# Auth
For all the auth endpoints passport.js local strategy is used.
> Refer to passport.js [docs](http://www.passportjs.org/docs/downloads/html/).
#### POST - /login
Takes username and password as parameters.

    const  customFields  = {
    usernameField: 'username',
    passwordField: 'password',
    }

#### POST  - /register
Takes username, password and email as default parameters

#### GET - ./is-logged
Check if user is logged in

Returns - 

    res.json({
    "user": req.user.username,
    "email": req.user.email,
    "success": true,
    });
