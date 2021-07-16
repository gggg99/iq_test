const Order = require('../models/order.js');
const Question = require('../models/question.js');
const crypto = require('crypto');
const utilities = require('../misc/index');
const nodeMailer = require('../config/nodemailer');
const config = require('../config')

module.exports.createOrder = async (req, res) => {
    const questions = await Question.find({});
    const incrementResult = utilities.calculateResult(req.body, questions);
    
    Order.create({
        price: "50.00",
        status: "pending",
        result: incrementResult
    },
    function(err, order){
        if(err){console.log(err); return res.status(400);}
        console.log('order created', order);

        const paymentData = {
            LMI_PAYMENT_AMOUNT: "50.00",
            LMI_PAYMENT_DESC: "IQ Test",
            ORDER_ID: order._id,
            LMI_PAYEE_PURSE: config.purse,
            LMI_SIM_MODE: 0
        }

        return res.status(200).json(paymentData);
    })
}

module.exports.resultOrder = async (req, res) => {
    const {
        LMI_PAYMENT_AMOUNT, 
        LMI_HASH,
        LMI_PAYEE_PURSE,
        LMI_PREREQUEST,
        LMI_MODE,
        LMI_SYS_INVS_NO,
        LMI_SYS_TRANS_NO,
        LMI_SYS_TRANS_DATE,
        LMI_PAYER_PURSE,
        LMI_PAYER_WM,
        EMAIL,
        ORDER_ID
    } = req.body

    console.log(req);

    const LMI_SECRET_KEY = config.secretKey;

    const order = await Order.findById(ORDER_ID);

    if (LMI_PREREQUEST == 1 && order && EMAIL){
        if (ORDER_ID == order._id &&  LMI_PAYMENT_AMOUNT == order.price){
            res.status(200).end('YES')
        }else res.status(400);
    }else{
        if (ORDER_ID && order){
            const hashString = `${LMI_PAYEE_PURSE}${order.price}0${LMI_MODE}${LMI_SYS_INVS_NO}${LMI_SYS_TRANS_NO}${LMI_SYS_TRANS_DATE}${LMI_SECRET_KEY}${LMI_PAYER_PURSE}${LMI_PAYER_WM}`;
            const sha256Sum = crypto.createHash('sha256').update(hashString).digest('hex');
            const hashCheck = LMI_HASH.toLowerCase() === sha256Sum;
            if (hashCheck) {
                const questions = await Question.find({});
                order.status = 'completed';
                order.email = EMAIL;
                order.save();
                const resultMessage = utilities.generateResultMessage(questions, order.result);
                const dataSend = await nodeMailer.sendEmail(resultMessage, EMAIL);
                if (dataSend) res.status(200).end('success');
            }
        }
    }
}

module.exports.successOrder = async (req, res) => {

    const {ORDER_ID} = req.body;

    const order = await Order.findById(ORDER_ID);
    const questions = await Question.find({});

    if (order.status == 'completed'){
        const resultMessage = utilities.generateResultMessage(questions, order.result);

        const markup = `
            <style>div{font-size: "30px"}</style>
            <div>
                ${resultMessage}
            </div>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.send(markup);
    }else{
        res.setHeader('Content-Type', 'text/html');
        res.send('Ваши результаты не оплачены');
    }
}