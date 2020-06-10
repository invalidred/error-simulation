# error-simulation

The Objective of this repo is to simulate various errors suchs as
 - Client 4xx errors
 - Server 5xx errors
 - Responses with custom delays
 - Application Timeout Errors
 - Network Errors
 - Socket Timeout Errors
 - **Importance** of having **low level** insights into `socket` and **`timing metrics`**!

### To Start
1. `npm i` in `/server` & `/client`
2. `npm start` `/server/index.js`
3. Pick simulation you'd like to try by uncommenting lines in `/client/index.js` and inspecting the console.
4. `npm start` `/client/index.js`

### Profit!
