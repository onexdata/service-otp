module.exports = {
    otp: {
        length: 64,
        chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        expires: 60 * 1000, // When OTPs expire (in ms)
        clean: 60 * 1000    // How often to clean out expired OTPs (in ms)
    },
    endpoints: {
        port: 3099,
        create: '/create',
        verify: '/verify'
    }
}