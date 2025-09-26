/**
 * Roblox Passport Strategy // passport-roblox-luke
 * Based on passport-oauth2
 *
 */

var OAuth2Strategy     = require('passport-oauth2')
, InternalOAuthError   = require('passport-oauth2').InternalOAuthError
, util                 = require('util');

/**
* Options for the Strategy.
* @typedef {Object} StrategyOptions
* @property {string} clientID
* @property {string} clientSecret
* @property {string} callbackURL
* @property {boolean} [pkce=true]
* @property {string} [authorizationURL="https://authorize.roblox.com"]
* @property {string} [tokenURL="https://apis.roblox.com/oauth/v1/token"]
* @property {Array<string>} [scope=["openid","profile"]]
*/

/**
* `Strategy` constructor.
*
* The Roblox OAuth2 strategy.
*
* Applications must supply a `verify` callback which accepts an
* `accessToken`, `refreshToken` and service-specific `profile`.
*
* @constructor
* @param {StrategyOptions} options
* @param {function} verify
* @access public
*/
function Strategy(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || 'https://authorize.roblox.com';
    options.tokenURL = options.tokenURL || 'https://apis.roblox.com/oauth/v1/token';
    options.pkce = options.pkce !== undefined ? options.pkce : true; // Roblox requires PKCE
    options.scope = options.scope || ['openid', 'profile'];

    OAuth2Strategy.call(this, options, verify);
    this.name = 'roblox';
    this._oauth2.useAuthorizationHeaderforGET(true);
}

/**
 * Inherits from `OAuth2Strategy`
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Roblox API
 *
 * This function constructs and returns a profile object:
 *     - `provider`  always set to `roblox`
 *     - `id`        the Roblox user identifier (sub claim)
 *     - `username`  the Roblox display name (if available)
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
    this._oauth2.get('https://apis.roblox.com/oauth/v1/userinfo', accessToken, function (err, body) {
        if (err) {
            return done(new InternalOAuthError('Failed to fetch user profile', err));
        }

        let data;
        try {
            data = JSON.parse(body);
        } catch (e) {
            return done(new Error('Failed to parse the Roblox profile response.'));
        }

        const profile = {
            provider: 'roblox',
            id: data.sub,
            username: data.name || null
        };

        return done(null, profile);
    });
};

/**
* Options for the authorization.
* @typedef {Object} authorizationParams
* @property {any} permissions
* @property {any} prompt
*/
/**
* Return extra parameters to be included in the authorization request.
*
* @param {authorizationParams} options
* @return {Object}
* @api protected
*/
Strategy.prototype.authorizationParams = function(options) {
   var params = {};
   if (typeof options.permissions !== 'undefined') {
       params.permissions = options.permissions;
   }
   if (typeof options.prompt !== 'undefined') {
       params.prompt = options.prompt;
   }
   return params;
};

/**
* Expose `Strategy`.
*/
module.exports = Strategy;

