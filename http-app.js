const http = require('http')
const port = 3000
const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('content-type', 'text/plain')
    res.end('Opa, deu boa!!!')
})
server.listen(port, () =>{
    console.log('Server ok!!')
})


