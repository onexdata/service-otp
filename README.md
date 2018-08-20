# service-otp
Simple OTP (One Time Password) service with Koa.

This does not implement HOTP or TOTP and has no intention to do so. This is instead a simple OTP implementation for link-based authentication.

## Usage
You give it data, it gives you an OTP.
```
http://127.0.0.1:8080/create/:yourDataHere

Returns :

UUwk9201o9jelWkwjekdiqosZlep3dh937gdjnds08hjIHwijwoosjihsiod9h98
```
You give it an OTP, it gives you data, and destroys the OTP.
```
http://127.0.0.1:8080/verify/:yourOTPHere

Returns :

Your data.

```

## Technology used
This uses Koa and koa-router.  It also takes advantage of an in-memory database to house the One Time Passwords.  This is BLAZINGLY fast; tens-of-thousands of request per second. Uses 13mb of memory.  Boots in 500ms.

## Installation
Clone repo, then...
```
npm install
node app
```
...Done!

Listens on port 8001 by default, so you will browse to http://127.0.0.1/:8080/create/:yourDataHere to create an OTP.


## Configuration options
Configure anything in the service using the /config.js file in the root of the project.

```
    otp: {
        length: 64, // Can be any size. 64 bytes = Less than 1 in a googol chance of guessing.
        // Charset to generate the OTP from.
        chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        expires: 60 * 1000, // When OTPs expire (in ms)
        clean: 60 * 1000    // How often to clean out expired OTPs (in ms)
    },
    endpoints: {
        // The port to use
        port: 8001,
        // The create endpoint
        create: '/create',
        // The verify endpoint
        verify: '/verify'
    }
```
## Cleanup
To prevent slow-down, service-otp performs routine cleanup of expired OTPs. By default this happens every 60 seconds. You can change this using the config options above.

## Logging in production
service-otp sends output to stdio.  Use a service manager (like nssm in windows) to maintain service-otp just like you would in any other container.

## Is this ready for production?
Yes. Although I make no guarentees or warranties, there is less than 100 lines of code and every dependancy has no issues and is tested thuroughly. I use this in production.