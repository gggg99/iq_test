const express = require("express");
const cors = require('cors')
const db = require('./config/mongoose');

const questionsController = require('./controllers/questionsController');
const orderController = require('./controllers/orderController');

const app = express();

const port = 80;

app.listen(port,function(err)
{
     if(err)  {console.log(`Error in running server:${port}`);return;}

     console.log(`Surver is up and Running at POrt :${port}`); return;
});

app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors());

app.get('/questions', questionsController.getQuestions);
// app.post('/questions/create', questionsController.createQuestion);

app.post('/order/create', orderController.createOrder);
app.post('/order/result', orderController.resultOrder);
app.post('/order/success', orderController.successOrder);