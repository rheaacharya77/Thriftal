var mongoose= require('mongoose');
const rentdetailsSchema = mongoose.Schema({
    name: String,
    price: Number,
    condition:String,
    description: String,
    image:String,

    createdDate: {
        type:Date,
        default:Date.now
    }
});
module.exports= mongoose.model('rentdetails',rentdetailsSchema)