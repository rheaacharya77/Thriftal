
var express = require('express');
var router = express.Router();
var productdetails = require('../models/productdetails');
var rentdetails = require('../models/rentdetails');
//var Cart= require('../models/cart');
var userdetails = require('../models/userdetails');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');


var multer = require('multer');
const path = require('path');
var storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  }
});


var upload = multer({
  storage: storage

}).single('image');


router.get('/index', function (req, res, next) {
  productdetails.find().exec(function (err, productdetails) {
    console.log('....data', productdetails)
    res.render('index', { productdetails })
  })
});

router.get('/adddetails', ensureAuthenticated, function (req, res, next) {
  res.render('adddetails', {
    name: req.user.name
  }
  )
});


router.post('/adddetails', upload, function (req, res, next) {
  console.log(req.file)
  var productdetail = new productdetails({
    name: req.body.name,
    price: req.body.price,
    condition: req.body.condition,
    description: req.body.description,
    image: req.file.filename,

  })

  var promise = productdetail.save()
  promise.then((productdetails) => {
    console.log('product saved', productdetails)
    res.render('editdelete', { productdetails });
  }).catch((error) => {
    console.log(error);
  })
});


router.get('/viewdetails/:_id', function (req, res, next) {
  productdetails.findOne({ _id: req.params._id }, function (err, productdetails) {
    console.log('product selected.....', productdetails)
    res.render('viewdetails', { productdetails })

  })
})

router.get('/confirmation', function (req, res, next) {
  res.render('confirmation')
})
router.get('/confirmation/:id', function (req, res, next) {
  productdetails.findOne({ _id: req.params.id }, function (err, productdetails) {
    console.log('selected....', productdetails)
    res.render('confirmation', { productdetails })
  })
})

router.get('/cart', function (req, res, next) {
  res.render('rentcart')
})
router.get('/cart/:id', function (req, res, next) {
  rentdetails.findOne({ _id: req.params.id }, function (err, rentdetails) {
    console.log('product selected....', rentdetails)
    res.render('rentcart', { rentdetails })
  })
})

router.get('/cart1', function (req, res, next) {
  res.render('cart')
})
router.get('/cart1/:id', function (req, res, next) {
  productdetails.findOne({ _id: req.params.id }, function (err, productdetails) {
    console.log('product selected....', productdetails)
    res.render('cart', { productdetails })
  })

})




router.get('/delete/:_id', function (req, res, next) {
  productdetails.deleteOne({ _id: req.params._id }, function (err, productdetails) {
    console.log('deleted.....', productdetails)
    res.redirect('/index')

  })
})
router.get('/delete1/:_id', function (req, res, next) {
  productdetails.deleteOne({ _id: req.params._id }, function (err, productdetails) {
    console.log('deleted.....', productdetails)
    res.redirect('/index')

  })
})


router.get('/editdelete', function (req, res, next) {
  res.render('editdelete')
})

router.get('/delete1/:_id', function (req, res, next) {
  productdetails.deleteOne({ _id: req.params._id }, function (err, productdetails) {
    console.log('product deleted.....', productdetails)
    res.redirect('/index')

  })
})


router.get('/update/:_id', function (req, res, next) {
  productdetails.findOne({ _id: req.params._id }, function (err, productdetails) {
    console.log('movie selected........', productdetails)
    res.render('updatedetails', { productdetails });
  })
})

router.post('/update', function (req, res, next) {
  productdetails.findOneAndUpdate({ _id: req.body._id }, { $set: req.body }, function (err, productdetails) {
    console.log('selected........', productdetails)
    res.redirect('/index');
  })
})

router.get('/rentproducts', function (req, res, next) {
  rentdetails.find().exec(function (err, rentdetails) {
    console.log('....data', rentdetails)
    res.render('rentproducts', { rentdetails })
  })
});


router.get('/rentdetails', function (req, res, next) {
  res.render('rentdetails')
})


router.post('/rentdetails', upload, function (req, res, next) {
  console.log(req.file)
  var rentdetail = new rentdetails({
    name: req.body.name,
    price: req.body.price,
    condition: req.body.condition,
    description: req.body.description,
    image: req.file.filename,

  })

  var promise = rentdetail.save()
  promise.then((rentdetails) => {
    console.log('product saved', rentdetails)
    res.render('save', { rentdetails });
  }).catch((error) => {
    console.log(error);
  })
});



router.get('/viewrentdetails/:_id', function (req, res, next) {
  rentdetails.findOne({ _id: req.params._id }, function (err, rentdetails) {
    console.log('product selected.....', rentdetails)
    res.render('viewrentdetails', { rentdetails })

  })
})

router.get('/cartdisplay/:_id', function (req, res, next) {
  productdetails.findOne({ _id: req.params._id }, (function (err, productdetails) {
    console.log(',,,,,data', productdetails)
    var displaycart = { items: [{ name: 'name', price: 'price' }] }
    for (var item in productdetails) {
      displaycart.items.push(productdetails[item]);
      // total += (productdetails[item].price)
    }

    res.render('cart')
  }))

});



// router.post('/cart1',function(req, res, next) {

//   var orderdetail = new orderdetails({
//   name: req.body.name,
//   price: req.body.price,

// })

// var promise = orderdetail.save()
// promise.then((orderdetails) => {
//   console.log('product saved',orderdetails)
//   res.render('cart', {orderdetails});
// }).catch((error)=>{
//    console.log(error);
// })
// });


router.get('/login', function (req, res, next) {
  res.render('login')
})


router.get('/register', function (req, res, next) {
  res.render('register')
})
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 4) {
    errors.push({ msg: 'Password must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    userdetails.findOne({ email: email })
      .then(user => {
        if (user) {
          errors.push({ msg: "Email is already registered" })
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {

          const newUser = new userdetails({
            name,
            email,
            password
          });


          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
  }
});



router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/adddetails',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/checkout', function (req, res, next) {
  res.render('checkout')
});
// router.post('/rentdetails',upload, function(req, res, next) {
//   console.log(req.file)
//   var rentdetail = new rentdetails({
//   name: req.body.name,
//   price: req.body.price,
//   condition: req.body.condition,
//   description: req.body.description,
//   image: req.file.filename,

// })

// var promise = rentdetail.save()
// promise.then((rentdetails) => {
//   console.log('product saved',rentdetails)
//   res.render('save', {rentdetails});
// }).catch((error)=>{
//    console.log(error);
// })
// });


//  router.get('/add-to-cart/:id', function(req, res, next){
//    var productId = req.params.id;
//  var cart = new Cart(req.session.cart ? req.session.cart : {});

//    productdetails.findById(productId, function(err, productdetails) {
//      if (err){
//        return res.redirect('/index');
//      }
//     cart.add(productdetails, productdetails.id);
//     req.session.cart = cart;
//     console.log(req.session.cart);
//     res.redirect('/index');
//    });
//  });




module.exports = router;









