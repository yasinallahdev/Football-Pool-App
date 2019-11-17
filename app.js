const port = process.env.PORT || 8080;
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const url = "mongodb+srv://FrostyPhoenixAdmin:gz1ErmEY9fM2zdrM@cluster0-n8pgw.azure.mongodb.net/test?retryWrites=true&w=majority"
const dbName = "footballPool"

app.listen(port, () => {
    MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.get('/', (request, response) => {
    db.collection('footballPool').find().toArray((err, result) => {
        if (err) return console.log(err)
        response.render('index.ejs', {poolData: result})
    });
});

app.post('/addToPool', (request, response) => {
    db.collection('footballPool').save({person: request.body.person, totalWins: parseFloat(request.body.totalWins)}, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      response.redirect('/')
    })
});

app.get('/footballWinner', (request, response) => {
    db.collection('footballPool').find().toArray((error, result) => {
        if(error) {
            return console.log(error);
        }
        if(result.length === 0) {
            return console.log("There were no people to choose from.");
        }
        let currentWinner = result[0];
        let winnerTies = [];
        for(let i = 0; i < result.length; i++) {
            if(result[i].totalWins > currentWinner.totalWins) {
                currentWinner = result[i];
                winnerTies = [result[i]];
            } else if(result[i].totalWins === currentWinner.totalWins) {
                winnerTies.push(result[i]);
            }
        }
        if(winnerTies.length > 1) {
            currentWinner = winnerTies[Math.floor(Math.random() * winnerTies.length)];
        }
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(JSON.stringify(currentWinner));
        response.end();
    });
});

app.delete("/clearPool", (request, response) => {
    db.collection('footballPool').deleteMany({}, (err, result) => {
        if (err) return res.send(500, err)
        response.send('Message deleted!');
    });
})
