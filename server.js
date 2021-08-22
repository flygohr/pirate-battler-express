const express = require('express');
const pirateBattle = require('./pirate-battle')

const app = express()
const port = 3000

app.get('/fight', async (req, res) => {
    try {
        let pirates = req.query.pirates;
        if(!pirates) {
            res.status(400)
            res.send({error: "Missing pirates search parameter"})
        }
        console.log(pirates);
        if(!/\d+,\d+/.test(pirates)) {
            res.status(400)
            res.send({error: "Pirates search parameter incorrectly formatted. Provide two, comma separated objkt ids"})
        }
        const [objktIdOne, objktIdTwo] = pirates.split(',');
        const logs = await pirateBattle(objktIdOne, objktIdTwo)
        res.send(logs)
    } catch(e) {
        res.status(500)
        res.send({error: "Server Error"})
    }

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
