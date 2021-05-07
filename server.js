const express = require('express')
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()

app.listen(3000, function() {
    console.log('listening on 3000')
  })
  // Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({ extended: true }))


const connectionString ="mongodb+srv://admin:1234@cluster0.gn1km.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
MongoClient.connect(connectionString, {
  useUnifiedTopology: true
}, (err, client) => {
  if (err) return console.error(err)
  console.log('Connected to Database')
  const db = client.db('awsome-quoats')
  const quotesCollection = db.collection('quotes')

   // ========================
    // Middlewares
    // ========================
  app.set('view engine', 'ejs')
  app.use(express.static('public'))
  app.use(bodyParser.json())

  /* add */
  app.post('/quotes', (req, res) => {
    quotesCollection.insertOne(req.body)
      .then(result => {
        res.redirect('/')
      })
      .catch(error => console.error(error))
  })

  /* read */
 app.get('/', (req, res) => {
       db.collection('quotes').find().toArray()
         .then(quotes => {
           res.render('index.ejs', { quotes: quotes })
         })
      .catch(error => console.error(error))
  })

  /* update */
  app.put('/quotes', (req, res) => {
    quotesCollection.findOneAndUpdate(
      { name: 'Yoda' },
      {
        $set: {
          name: req.body.name,
          quote: req.body.quote
        }
      },
      {
        upsert: true
      }
    )
    .then(result => {
           res.json('Success')
         })
      .catch(error => console.error(error))
  })

  /* delete */
  app.delete('/quotes', (req, res) => {
    quotesCollection.deleteOne(
      { name: req.body.name }
    )
      .then(result => {
        if (result.deletedCount === 0) {
          return res.json('No quote to delete')
        }
        res.json('Deleted Darth Vadar\'s quote')
      })
      .catch(error => console.error(error))
  })



})





  /* app.get('/', (req, res) => { */
  /*   res.sendFile(__dirname + '/index.html') */
  /* }) */

  /* app.get('/', (req, res) => { */
  /*   res.send('Hello World') */
  /* }) */

  /* app.post('/quotes', (req, res) => { */
  /*   console.log('Hellooooooooooooooooo!') */
  /* }) */

  /* app.post('/quotes', (req, res) => { */
  /*   console.log(req.body) */
  /* }) */
