const Order = require("../modals/orderModal");

const Product =  require("../modals/productModal");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeature = require("../utils/apiFeature");



//create new Order

exports.newOrder = catchAsyncErrors(async (req,res,next)=>{


    const {

        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,

    }=req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,

    });

    res.status(201).json({
        success:true,
        order,
    })

});


//get single order

exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if(!order){
        return next(new ErrorHandler("Order Not Found With This Id",404));
    }

    res.status(200).json({
        success:true,
        order
    });


});


//get logged in user

//get single order

exports.myOrders = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.find({user:req.user._id});


    

    res.status(200).json({
        success:true,
        order
    });


});




//get all Orders ==Admin


exports.getAllOrders = catchAsyncErrors(async (req,res,next)=>{
    const orders = await Order.find();

    let totalAmount =0;
    
    orders.forEach((order)=>{
        totalAmount+=order.totalPrice;
    });

   

    res.status(200).json({
        success:true,
        orders,
        totalAmount
    })
})


//update order status

exports.updateOrderStatus = catchAsyncErrors(async (req,res,next)=>{
    const order = await Order.findById(req.params.id);


    if(!order){
        return next(new ErrorHandler("Order Not Found With This Id",404));
    }

    if(order.orderStatus === "Delivered"){

        return next(new ErrorHandler("You have already delivered this product",404));

        
    } 

    order.orderItems.forEach(async (o)=>{
        await updateStock(o.product,o.quantity);
    });

   order.orderStatus = req.body.status;

   
   if(req.body.status === "Delivered"){
    order.deliveredAt = Date.now();

   }

   await order.save({validateBeforeSave:false});


    res.status(200).json({
        success:true,
        
    });
});



async function updateStock(id,quantity){
    const product = await Product.findById(id);

    product.stock =product.stock-quantity;

    await product.save({validateBeforeSave:false});


}  


exports.deleteOrder = catchAsyncErrors(async (req,res,next)=>{
    const order = await Order.findById(req.params.id);



    if(!order){
        return next(new ErrorHandler("Order Not Found With This Id",404));
    }

    await order.remove()

   

    res.status(200).json({
        success:true,
        
    })
})

