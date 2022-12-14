const Product = require('../models/product.model');

async function getProducts(req,res,next){
    try{
       const products = await Product.findAll(); 
       res.render('admin/products/all-products',{products:products});
    }catch(err){
        next(err);
        return;

    }
    
    

}

function getNewProduct(req,res){
    res.render('admin/products/new-product');

}

async function createNewProduct(req,res,next){
   const product = new Product ({
    ...req.body,
    image:req.file.filename
   });
   try{
    await product.save();
   } catch(err){
    next(err);
    return;
   }
   

    res.redirect('/admin/products');
            

}

async function getUpdateProduct(req,res,next){
    try{
      const product = await Product.findById(req.params.id);
      res.render('admin/products/update-product',{product:product});  
    }catch(error){
        next(error);
    
    }
    
}

async function UpdateProduct(req,res,next){
    const product = new Product({
        ...req.body,
        _id:req.params.id
    });

    if(req.file){
        product.replaceImage(req.file.filename);
    }

    try{
        await product.save();
    }catch(error){
        next(error);
        return;
    }

    res.redirect('/admin/products');
}

async function deleteProduct(req,res,next){
    let product;
    console.log('Deleting Product: ');
    
    try{
        product = await Product.findById(req.params.id); 
        //await Product.remove(req.params.id);
        await product.remove();
    }catch(error){
        return next(error);
    }
    
    res.json({message:'Deleted product!'});
   
}

module.exports={
    getProducts:getProducts,
    getNewProduct:getNewProduct,
    createNewProduct:createNewProduct,
    getUpdateProduct:getUpdateProduct,
    UpdateProduct:UpdateProduct,
    deleteProduct:deleteProduct 
};