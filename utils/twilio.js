const accountSid = process.env.accountSid;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.verifySid;
const client = require('twilio')(accountSid, authToken);
module.exports = {
    accountSid,
    authToken,
    verifySid,
    client
  };
  