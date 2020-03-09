var mongoose= require('mongoose');
const productdetailsSchema = mongoose.Schema({
    name: String,
    price: Number,
    size: String,
    condition:String,
    description: String,
    image:String,

    createdDate: {
        type:Date,
        default:Date.now
    }
});
module.exports= mongoose.model('productdetails',productdetailsSchema)