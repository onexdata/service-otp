const Koa = require('koa')
const routes = require('koa-router')()
const db = require('nano-memo')
const config = require('./config')
const app = new Koa()

db.register('otp')

// Returns a 64-byte base62 randomized string. All an OTP needs to be is guarenteed not to collide and not to guess.
// 64 ^ 62 colission/guess chance = (1 in 3.94e+115 / total otp in wild) / e
function getOTP(length = config.otp.length, chars = config.otp.chars) {
	var result = ''
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
    return result;
}

// True if valid, else false
const validOTP = otp => new Date().getTime() - otp.expires > 0 ? false : true

// OTP is an internal service. OTP has no business verifying validity of anything it's sent, only storing it.
routes.get(config.endpoints.create + '/:data', ctx => {
    let otp = getOTP() // Create.
    let expires = new Date().getTime() + config.otp.expires
    db.memoize('otp', otp, { data: ctx.params.data, expires: expires }) // Store.
    ctx.body = otp // Return.
    console.log(`Created OTP ${otp} data: ${ctx.params.data}`)
})

// Verifies the OTP, has no business verifying the data it returns.
routes.get(config.endpoints.verify + '/:otp', ctx => {
    let valid = false
    let otp = db.exists('otp', ctx.params.otp) // Retrieve.
    if (otp) {
        db.invalidate('otp', ctx.params.otp) // Delete.
        valid = validOTP(otp)
    }

    console.log(`Requesting ${ctx.params.otp} valid: ${valid}`)

    ctx.assert(valid, 401, 'Not Authorized.') // Valid?

    ctx.response.status = 200 // Return.
    ctx.body = otp.data
})

// Remove invalid entries...
setInterval(() => {
    let entries = 0, invalid = 0
    Object.entries(db.data('otp')).forEach ((entry) => {
        //let otp = entry[0]
        //let data = entry[1]
        let [otp, data] = entry
        if (!validOTP(data.data)) {
            console.log('Invalid:', otp)
            db.invalidate('otp', otp)
            invalid++
        }
        entries++
    })
    console.log(`Performed OTP cleanup. Entries: ${entries} Invalidated: ${invalid}`)
}, config.otp.clean)

app.use(routes.routes())
app.listen(config.endpoints.port)
