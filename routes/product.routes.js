const express = require('express');

const productsController = require('../controllers/products.controller');

const router = express.Router();

router.get('/products', productsController.getAllProducts);
// router.get('/products',function(req,resp){
//     console.log('In Route');
//     resp.get('/products', productsController.getAllProducts);
// });

router.get('/products:id',productsController.getProductDetails);


module.exports = router;