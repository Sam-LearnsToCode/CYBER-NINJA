const Product = require('../models/product.model');

async function getAllProducts(req,res,next){
    try{
        console.log('Product Page1');
      const products=await Product.findAll();
      res.render('customer/product/all-products',{products:products});  
    }catch(error){
        next(error);
    }
   
    
}

async function getProductDetails(req,res,next){
    console.log('Getting Products...');
    try{
        const product = await Product.findById(req.params.id);
        res.render('/customer/product/product-details',{product:product});
    }catch(error){
        next(error);
        
    }

}

module.exports={
    getAllProducts:getAllProducts,
    getProductDetails:getProductDetails
};