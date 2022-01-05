const express = require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrderStatus, deleteOrder } = require("../controllers/orderController");

const router = express.Router();

const { isAuthenticatorUser,authorizeRoles } = require("../middleware/auth");


router.route("/order/new").post(isAuthenticatorUser,newOrder);

router.route("/order/:id").get(isAuthenticatorUser,getSingleOrder);

router.route("/orders/me").get(isAuthenticatorUser,myOrders);

router.route("/admin/orders").get(isAuthenticatorUser,authorizeRoles("admin"),getAllOrders);

router.route("/admin/order/:id").put(isAuthenticatorUser,authorizeRoles("admin"),updateOrderStatus).delete(isAuthenticatorUser,deleteOrder);





module.exports = router;
