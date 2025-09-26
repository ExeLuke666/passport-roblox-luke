# passport-roblox-luke

**An unofficial Roblox authentication strategy for [Passport.js](http://www.passportjs.org/).**

This module allows you to authenticate users using their **Roblox accounts** via the OAuth 2.0 protocol.

> ⚠️ This is an **unofficial** strategy and is **not affiliated with or endorsed by Roblox Corporation**.

---

## Installation

```bash
npm install passport-roblox-luke
```

---

## Usage

First, make sure you have a [Passport](http://www.passportjs.org/) setup in your Node.js application.

### 1. Configure the Strategy

In your main server file (e.g., `index.js`), configure the Roblox strategy:

```js
const passport = require('passport');
const RobloxStrategy = require('passport-roblox-luke');

passport.use(new RobloxStrategy({
  clientID: yourConfig.RobloxClientID,
  clientSecret: yourConfig.RobloxClientSecret,
  callbackURL: 'https://yourdomain.com/auth/roblox/callback',
  scope: ['openid', 'profile'],
  state: true
}, (accessToken, refreshToken, profile, done) => {
  // You can handle profile storage here
  return done(null, profile);
}));
```

---

### 2. Set Up the Authentication Routes

Add the following routes to initiate and handle the Roblox login flow:

```js
app.get('/auth/roblox', passport.authenticate('roblox', { scope: ['openid', 'profile'] }));

app.get('/auth/roblox/callback',
  passport.authenticate('roblox', { failureRedirect: '/login' }),
  async (req, res) => {
    // Import account data or handle login session here
    res.redirect('/'); // Or wherever you want to redirect after login
  }
);
```

---

## Example Profile Object
After successful authentication, the `profile` object returned may contain basic user information from Roblox (depending on scope and API changes).

---

## License

MIT
