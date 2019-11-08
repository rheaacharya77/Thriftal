
var express = require('express');
var router = express.Router();
var productdetails= require('../models/productdetails');


 router.get('/index', function(req, res, next) {
  productdetails.find().exec(function(err,productdetails){
    console.log('....data',productdetails)
   res.render('index',{productdetails})
  })
});   

router.get('/adddetails',function(req,res,next){
  res.render('adddetails')
})




router.post('/adddetails', function(req, res, next) {
  console.log(req.body)
  var productdetail = new productdetails({
  name: req.body.name,
  price: req.body.price,
  condition: req.body.condition,
  description: req.body.description,
})

var promise = productdetail.save()
promise.then((productdetails) => {
  console.log('product saved',productdetails)
  res.render('editdelete', {productdetails});
}).catch((error)=>{
   console.log(error);
})
});


router.get('/viewdetails/:_id',function(req,res,next)
{
  productdetails.findOne({_id: req.params._id},function(err,productdetails){
     console.log('movie selected.....',productdetails)
    res.render('viewdetails',{productdetails})

 })
})

router.get('/confirmation',function(req,res,next){
  res.render('confirmation')
})
router.get('/confirmation/:id', function(req, res, next) {
   productdetails.findOne({_id:req.params.id}, function(err,productdetails){
     console.log('movie selected....',productdetails)
     res.render('confirmation',{productdetails})
 })
 })

router.get('/delete/:_id',function(req, res, next) {
  productdetails.deleteOne({_id:req.params._id}, function(err,productdetails){
    console.log('movie deleted.....',productdetails)
    res.redirect('/index')
  
})
})
router.get('/delete1/:_id',function(req, res, next) {
  productdetails.deleteOne({_id:req.params._id}, function(err,productdetails){
    console.log('movie deleted.....',productdetails)
    res.redirect('/index')
  
})
})



router.get('/rentproducts',function(req,res,next){
  res.render('rentproducts')
})


router.get('/editdelete',function(req,res,next){
   res.render('editdelete')
 })

 router.get('/delete1/:_id',function(req, res, next) {
    productdetails.deleteOne({_id:req.params._id}, function(err,productdetails){
      console.log('product deleted.....',productdetails)
      res.redirect('/index')
    
   })
   })


   router.get('/update/:_id', function (req, res,next) {
    productdetails.findOne({_id: req.params._id},function(err,productdetails)
    {
      console.log('movie selected........',productdetails)
      res.render('updatedetails',{productdetails});
    })
  })

  router.post('/update', function (req, res,next) {
    productdetails.findOneAndUpdate({_id: req.body._id},{$set: req.body},function(err,productdetails)
    {
      console.log('movie selected........',productdetails)
      res.redirect('/index');
    })
  })


module.exports = router ;









