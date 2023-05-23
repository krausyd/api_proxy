const express = require('express');
const app = express();
const port= process.env.PORT || 3000;
const keys = require("./apiKeys.json");

app.get('/', (req, res) => {
    res.send('This is the api proxy, to use it to get a token for your OAuth api, please do a GET request to https://bootcamp-apiproxy.herokuapp.com/token/{apikey}, replacing {apikey} with the api key given by your instructor.');
});


app.get('/token/:apikey', async (req, res) => {
    console.log(`Getting token for ${req.params.apikey}`);
    const dataKey = keys[req.params.apikey];
    if (dataKey) {
        const response = await fetch(dataKey.url, {
            method: 'POST',
            body: JSON.stringify({
                "grant_type": "client_credentials",
                "client_id": dataKey.client_id,
                "client_secret": dataKey.client_secret,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
        });
        if (response.status === 200) {
            const data = await response.json();
            console.log('Returning the token to the user');
            res.status(200).send(data);
        } else {
            console.log(`Api returned ${response.status}, ${response.statusText}`);
            res.status(response.status).send(response.statusText);
        }
    } else {
        res.status(404).json({"message":"api key not found"});
    }
});

app.listen(port, () => {
    console.log(`Api proxy ready and listening on port ${port}`);
})