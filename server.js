/* we use express in server.js by requiring it. */
const express = require('express')
const app = express()

/* A middleware to tidy up the request object before we use them to handle reading data from the form*/
const bodyParser= require('body-parser')
// Make sure you place body-parser before your CRUD handlers!
/* The urlencoded tells body-parser to extract data from the form element and add them to the body property in the request object */
app.use(bodyParser.urlencoded({ extended: true }))


/* create a server that browsers can connect to */
app.listen(3000, function() {
    console.log('listening on 3000')
  })


/*  connect to MongoDB */
const MongoClient = require('mongodb').MongoClient
/* connection string */
const connectionString ="mongodb+srv://admin:1234@cluster0.gn1km.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
MongoClient.connect(connectionString, {useUnifiedTopology: true}, (err, client) => {
  if (err) return console.error(err)
  console.log('Connected to Database')
  const db = client.db('awsome-quoats')
  const quotesCollection = db.collection('quotes')

   // ========================
    // Middlewares
    // ========================
    /* set view engine to ejs to tell Express we’re using EJS as the template engine */
  app.set('view engine', 'ejs')
  /* to tell Express to make this public folder accessible to the public */
  app.use(express.static('public'))
  /* to tell the server to accept JSON data */
  app.use(bodyParser.json())

  /* add */
  /* The endpoint should be the value you placed in the "action" attribute in the form */
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
        /* Insert a document if no documents can be updated */
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

/* serve up an index.html page back to the browser. */
  /* app.get('/', (req, res) => { */
  /*   res.sendFile(__dirname + '/index.html') */
  /* }) */


