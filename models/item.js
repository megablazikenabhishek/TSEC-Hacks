const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const format = require("date-format");

const ItemSchema = new Schema({
    user_id: String,
    product_name: String,
    tags: {
        type: Array,
        default: []
    },
    date: { type: String, default: format.asString("at dd/MM/yyyy on hh:mm", new Date()) },
    images: String,
    detail: String,
    price: Number,
    sold: {type: Boolean, default: false},
    seller_name:String,  
    location: String, 
    used_since: Number
},
{ collection: 'items' });


let Item = mongoose.model('items', ItemSchema);

module.exports = Item;