const express = require("express");
const { getAllProducts,
    createProduct ,
    updateProduct,
    getProductsDetails,
    deleteProduct,
    createProductReview,
    getProductReviews,
    deleteProductReviews
} = require("../controllers/productController");


const { isAuthenticatorUser,authorizeRoles } = require("../middleware/auth");

const router =  express.Router();


router.route("/products").get(getAllProducts);


router.route("/admin/product/new")
.post(isAuthenticatorUser,authorizeRoles("admin"),createProduct);

router.route("/admin/product/:id")
.put(isAuthenticatorUser,authorizeRoles("admin"),updateProduct)
.delete(isAuthenticatorUser,authorizeRoles("admin"),deleteProduct);

router.route("/product/:id").get(getProductsDetails);


router.route("/review").put(isAuthenticatorUser,createProductReview);


router.route("/reviews")
.get(getProductReviews)
.delete(isAuthenticatorUser,deleteProductReviews);

module.exports = router;