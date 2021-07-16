const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    price: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    result: {
        type: String,
        required: false
    },
    createdAt: { 
        type: Date, default: Date.now 
    }
})

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;