const { createProbot } = require('probot')
const { findPrivateKey } = require('probot/lib/private-key')
const applicationFn = require('../index.js')

const options = {
  cert: String(findPrivateKey()),
  id: Number(process.env.APP_ID),
  secret: process.env.WEBHOOK_SECRET,
  webhookPath: '/api/reminder'
}
const probot = createProbot(options)
const app = probot.load(applicationFn)
module.exports = (req, res) => {
  app.log('Receiving calling on reminder = %j', req.path)
  probot.server(req, res)
}
