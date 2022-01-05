const Product =  require("../modals/productModal");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeature = require("../utils/apiFeature");




//Create Product

exports.createProduct = catchAsyncErrors(async (req,res,next)=>{

    req.body.user=req.user.id;



    const product = await Product.create(req.body);


    res.status(201).json({
        success:true,
        product
    });
});

exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();
    
    const apiFeature = new ApiFeature(Product.find(), req.query)
      .search()
      .filter();
  
    let products = await apiFeature.query;
  
    let filteredProductsCount = products.length;
  
    apiFeature.pagination(resultPerPage);
  
    products = await apiFeature.query.clone();
  
    res.status(200).json({
      success: true,
      products,
      productsCount,
      resultPerPage,
      filteredProductsCount,
    });
  });


//update produ

exports.updateProduct = catchAsyncErrors(async (req,res,next)=>{
    let product =Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product Not Found",404))
    }

    product  = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    const productsCount = await Product.countDocuments();

    res.status(200).json({
        success:true,
        product,
        productsCount,
    })
});

//deleteProduct

exports.deleteProduct =catchAsyncErrors( async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product Not Found",404))
    }

    await product.remove();


    res.status(200).json({
        success:true,
        message:"Product Delete Successfully"
    })



    
});



//getSingleProductDetails

exports.getProductsDetails=  catchAsyncErrors(async(req,res,next)=>{

    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product Not Found",404))
    }

    res.status(200).json({
        success:true,
        product
    })


    
});


//create new reiview or update that reiview

exports.createProductReview = catchAsyncErrors(async (req,res,next)=>{


    const {ratings,comment,productId} = req.body;
    const reiview = {
        user:req.user._id,
        name:req.user.name,
        ratings:Number(ratings),
        comment
    }

    const product = await Product.findById(productId);

    const isReiewed = product.reviews.find(rev=>rev.user.toString()===req.user._id.toString());


    if(isReiewed){

        product.reviews.forEach(rev => {

            if(rev.user.toString()===req.user._id.toString()){

                (rev.ratings=ratings),(rev.comment=comment);
            }
            
            
        });

    }else{
        product.reviews.push(reiview);
        product.numOfReviews = product.reviews.length
    }
    let avg=0;
    product.reviews.forEach(rev=>{
        avg +=rev.ratings
    });

    product.rating=avg/product.reviews.length;


    await product.save({validateBeforeSave:false});



    res.status(200).json({
        success:true
    })

});



//Get all reviews of a single product


exports.getProductReviews = catchAsyncErrors(async (req,res,next)=>{
    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("Product Not Found",404));
    }


    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
});


exports.deleteProductReviews = catchAsyncErrors(async (req,res,next)=>{
    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("Product Not Found",404));
    }



    

    const reviews = product.reviews.filter(
        
        (rev)=>rev._id.toString() !== req.query.id.toString()



    );

    let avg=0;
    product.reviews.forEach(rev=>{
        avg +=rev.ratings
    });


    const rating  = avg/reviews.length;
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,
        {
            reviews,
            rating,
            numOfReviews
        },
        {
            new:true,
            runValidators:true,
            useFindAndModify:false
        }
    )
    


    res.status(200).json({
        success:true,
    })


});