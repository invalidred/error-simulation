const express = require('express')

const logMsg = (msg, port) => () => {
    console.log(`${port} -> ${msg}`)
}

function startResponseWithDelayServer(port) {
    const app = express()
    app.get('/delay/:delay', function (req, res) {
        const TEN_SECS = 10000
        const { delay = TEN_SECS } = req.params
        setTimeout(() => res.json({ foo: 'bar' }), delay)
    })
    app.listen(port, logMsg(`/delay/:delay`, port))
}

function start4xx5xxServer(port) {
    const app = express()

    app.get('/error/:statusCode', function (req, res) {
        const { statusCode = 500 } = req.params
        const { isLegacy } = req.query
        const legacyPayload = {
            statusCode,
            data: { foo: 'bar' }
        }
        const jsonApiError = {
            errors: [{
                status: statusCode,
                title: 'Sample title, not real.',
                details: 'This is just some details and its fake, so please ignore'
            }]
        }
        console.log('isLegacy', isLegacy, req.params)
        return res.status(Number(statusCode))
            .json(isLegacy ? legacyPayload : jsonApiError)
    })

    app.listen(port, logMsg(`/error/:statusCode`, port))
}

function startECONNRESETserver(port) {
    // https://stackoverflow.com/questions/22836424/simulate-an-econnreset-error-on-a-node-js-net-socket-instance
    const net = require('net')
    const server = net.createServer((socket) => {
        socket.end();
        socket.emit('error', new Error('ECONNRESET'));
    })

    server.listen(port, logMsg('ECONNRESET', port))
}

// Hard to simulate ETIMEDOUT from server
// Had to use `request` module to simulate it instead.
// function startETIMEDOUTserver(port) {
//     const http = require('http');
//     const server = http.createServer((req, res) => {
//         // res.connection.destroy('ETIMEDOUT')
//     });
//     // server.timeout = 10
//     server.listen(port, logMsg('ETIMEDOUT', port));
// }

startResponseWithDelayServer(3000)
start4xx5xxServer(3001)
startECONNRESETserver(3002)
// startETIMEDOUTserver(3003)
