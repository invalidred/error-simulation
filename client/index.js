const axios = require('axios')

const prop = (key) => obj => obj[key]


const axiosErrorWithStatusCode = ({ statusCode, isLegacy = false }) => axios
    .get(`http://localhost:3001/error/${statusCode}?isLegacy=${isLegacy}`)
    .then(prop('data'))


// API Calls

// Success Delay Call
function successWithOneSecondDelay(delayMs) {
    const axiosDelaySuccess = (delay) => axios
        .get(`http://localhost:3000/delay/${delay}`)
        .then(prop('data'))

    axiosDelaySuccess(delayMs).then(console.log)
}

// 4xx Error
function client400Error() {//
    axiosErrorWithStatusCode({ statusCode: 400 }).then(console.log).catch((error) => {
        console.log('error keys', Object.keys(error)) // [config, code, request, response, isAxiosError, toJSON]
        console.log('isAxiosError', error.isAxiosError) // true
        console.log('message', error.message) // timeout of 10ms exceeded
        console.log('errno', error.errno) // undefined
        console.log('response', Object.keys(error.response))
        console.log('response.data', error.response.data)
        // console.log('request', Object.keys(error.request)) // {} // big nested object
        console.log('code', error.code) // ECONNABORTEDT
        console.log('config', Object.keys(error.config)) // {} // url, verb
    })
}

// 4xx Legacy Error
function client400LegacyError() {
    axiosErrorWithStatusCode({ statusCode: 400, isLegacy: true }).then(console.log).catch((error) => {
        debugger
        console.log('error keys', Object.keys(error)) // [config, code, request, response, isAxiosError, toJSON]
        console.log('isAxiosError', error.isAxiosError) // true
        console.log('message', error.message) // timeout of 10ms exceeded
        console.log('errno', error.errno) // undefined
        console.log('response', Object.keys(error.response))
        console.log('response.data', Object.keys(error.response.data))
        // console.log('request', error.request) // {} // big nested object
        console.log('code', error.code) // ECONNABORTEDT
        console.log('config', Object.keys(error.config)) // {} // url, verb
    })
}

// 5xx Error
function server500Error() {
    axiosErrorWithStatusCode({ statusCode: 500 }).then(console.log).catch((error) => {
        console.log('error keys', Object.keys(error)) // [config, code, request, response, isAxiosError, toJSON]
        console.log('isAxiosError', error.isAxiosError) // true
        console.log('message', error.message) // timeout of 10ms exceeded
        console.log('errno', error.errno) // undefined
        console.log('response', Object.keys(error.response))
        console.log('response.data', Object.keys(error.response.data))
        // console.log('request', error.request) // {} // big nested object
        console.log('code', error.code) // ECONNABORTEDT
        console.log('config', Object.keys(error.config)) // {} // url, verb
    })
}

// 5xx Legacy Error
function server500LegacyError() {
    axiosErrorWithStatusCode({ statusCode: 500, isLegacy: true }).then(console.log).catch((error) => {
        debugger
        console.log('error keys', Object.keys(error)) // [config, code, request, response, isAxiosError, toJSON]
        console.log('isAxiosError', error.isAxiosError) // true
        console.log('message', error.message) // timeout of 10ms exceeded
        console.log('errno', error.errno) // undefined
        console.log('response', Object.keys(error.response))
        console.log('response.data', Object.keys(error.response.data))
        // console.log('request', error.request) // {} // big nested object
        console.log('code', error.code) // ECONNABORTEDT
        console.log('config', Object.keys(error.config)) // {} // url, verb
    })
}

// Software Timeout API Call
function softwareTimeoutError() {
    // ECONNABORTED - Software caused connection abort
    const axiosECONNABORTEDTimeoutError = () => axios.create({
        timeout: 10,
    }).get(`http://localhost:3000/delay/100`)

    axiosECONNABORTEDTimeoutError().catch((error) => {
        // console.log(JSON.stringify(error))
        // console.log(error.toJSON())
        console.log('error keys', Object.keys(error)) // [config, code, request, response, isAxiosError, toJSON]
        console.log('isAxiosError', error.isAxiosError) // true
        console.log('message', error.message) // timeout of 10ms exceeded
        console.log('errno', error.errno) // undefined
        console.log('response', error.response) // undefined
        console.log('request', Object.keys(error.request)) // {} // big nested object
        console.log('code', error.code) // ECONNABORTEDT
        console.log('config', prop('config')(error)) // {} // url, verb
    })
}

// Server Error
function serverConnectionResetError() {
    // ECONNRESET - Connection reset by peer
    const axiosECONNRESETError = () => axios.get(`http://localhost:3002/`, { timeout: 1000 })

    axiosECONNRESETError()
        .then(console.log)
        .catch((error) => {
            console.log(error.toJSON())
            console.log('error keys', Object.keys(error)) // [errno, code, syscall, config, request, response, isAxiosError, toJSON]
            console.log('isAxiosError', error.isAxiosError) // true
            console.log('message', error.message) // message connect ECONNREFUSED 127.0.0.1:3001
            console.log('errno', error.errno) // undefined
            // console.log('response', Object.keys(error.response)) // undefined
            console.log('address', error.address) // 127.0.0.1
            console.log('port', error.port) // 3001
            console.log('config', Object.keys(error.config)) // {} // url, method, headers, timeout, adapters
            console.log('request', Object.keys(error.request))
            console.log('code', error.code) // ECONNREFUSED
        })
}

// Socket Timeout & Time To Socket Connection From Kernel
function socketTimeoutError() {
    // ESOCKETTIMEDOUT
    const httpETIMEDOUTError = () => {
        const start = Date.now()
        const request = require('request')
        return new Promise((resolve, reject) => {
            const r = request('http://localhost:3003/', { timeout: 10 }, (error, response) => {
                if (error) {
                    return reject(error)
                }
                if (response)
                    console.log('response', Object.keys(response))
                return resolve(response)
            })

            // I think this is a very important metric that should not be overlooked I think.
            r.on('socket', (socket) => {
                const kernalTime = Date.now()
                let dnsTime
                console.log('Kernel socket time', kernalTime - start)
                socket.on('lookup', () => {
                    dnsTime = Date.now()
                    console.log('DNS lookup time', dnsTime - kernalTime)
                })
                socket.on('connect', () => {
                    const server = Date.now()
                    console.log('Server connection time', server - dnsTime)
                })
            })
        })
    }

    httpETIMEDOUTError()
        .then(console.log())
        .catch(error => {
            console.log('error.keys', Object.keys(error), error)
            console.log('error.code', error.code)
            console.log('error.connect', error.connect)
            console.log('error.message', error.message)
            console.log('error.errno:', error.errno)
            console.log('error.address', error.address)
            console.log('error.port', error.port)
        })
}


// Uncomment to try a simulation!
// successWithOneSecondDelay(2000)
// client400Error()
// client400LegacyError()
// server500Error()
// server500LegacyError()
// softwareTimeoutError()
serverConnectionResetError()
// socketTimeoutError()



// http://osr507doc.sco.com/en/netguide/disockD.error_codes.html
// Network Errors such as
// ECONNREFUSED,
// ECONNABORTED, ETIMEDOUT, ESOCKETTIMEDOUT - Timeout
// response = undefined & request = undefined
