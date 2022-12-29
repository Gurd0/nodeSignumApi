const express = require ('express');
const app = express();
const db = require("./models/db/nftDb")
const routesApi = require('./routes/api'); 
const routes = require('./routes/front');

const {Address} = require("@signumjs/core");


//const job = require("./backgroundWorker/background")
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')

app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({limit: '5000mb', extended: true, parameterLimit: 100000000000}));

app.use('/view', routes);

app.use('/api', routesApi); //to use the routes

//job.startJob()

app.post('/rederect', async (req, res) => {
    try {
        const address = Address.create(req.body.input)
 
        if(await db.isContractInNFT(address.getNumericId()) == 1){
            res.redirect(`/view/contract/${address.getNumericId()}`)
        }else if(await db.isCollectionInIpfs(address.getNumericId()) != 0){
            res.redirect(`/view/collection/${address.getNumericId()}`)
        }else{
            res.redirect(`/view/adress/${address.getNumericId()}`)
        }
    } catch (e) {
        // invalid input
        res.redirect("/error")
    }
})
app.get('/', async (req, res) => {
    res.render('index')
})
//Error
app.get('/error', (req, res) => {
   res.send("Error")
 })

 app.use((error, req, res, next) => {
   console.log("Error Handling Middleware called")
   console.log('Path: ', req.path)
   console.error('Error: ', error)
  
   if (error.type == 'redirect')
       res.redirect('/error')
 
    else if (error.type == 'time-out') // arbitrary condition check
       res.status(408).send(error)
   else
       res.status(500).send(error)
 })

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})