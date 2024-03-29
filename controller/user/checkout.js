var express = require("express");
var fs = require("fs");
const bcrypt = require("bcrypt");
var Catagory = require("../../models/catagory");
var Product = require("../../models/product");
var User = require("../../models/user");
const { findOne } = require("../../models/catagory");
const Cart = require("../../models/cart");
const { ObjectId } = require("mongodb");
const { resolve } = require("path");
// const { response } = require("express");
const Order = require("../../models/order");
const crypto = require("crypto");
var userHelpers = require("../../helpers/userhelpers");
const { AsyncLocalStorage } = require("async_hooks");
const { response } = require("express");
const paypal = require("@paypal/checkout-server-sdk");
const { Convert } = require("easy-currencies");
const {
  PayPalHttpClient,
} = require("@paypal/checkout-server-sdk/lib/core/lib");

const Enviornment =
  process.env.NODE_ENV === "production"
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment;

const paypalClient = new paypal.core.PayPalHttpClient(
  new Enviornment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
);

//Razorpay
// key_id: 'rzp_test_xE9ViN7qNPez7M',
// key_secret: 'Q8Np8zqRmJ1GxDArdSfCPu1a',

exports.shippingAddress = async (req, res) => {
  let checkoutData = await userHelpers.getTotalAmount(req.session.user._id);

  console.log("total....", checkoutData);

  let usercart = checkoutData.usercart;
  let total = checkoutData.too;

  res.render("user/shippingAddress", { total, usercart });
};

exports.checkout = async (req, res) => {
  let checkoutData = await userHelpers.getTotalAmount(req.session.user._id);

  console.log("total....", checkoutData);

  let usercart = checkoutData.usercart;
  let total = checkoutData.too;

  res.render("user/checkout", { total, usercart });
};

exports.placeorder = async (req, res) => {
  // console.log("place order..",req.body);
  let address = req.body;
  let paymentMethod = req.body.payment;
  // console.log("address..",address);
  // console.log("payment-method..",paymentMethod);

  let usercart = await Cart.find({ user: req.session.user });
  let checkoutData = await userHelpers.getTotalAmount(req.session.user._id);

  // console.log("place Order data....",checkoutData);
  let total = checkoutData.too;
  let products = checkoutData.usercart.cartitems;
  let cartid = usercart[0]._id;

  console.log("user cart id..", usercart[0]._id);
  // console.log("cart products..",products)
  // console.log("total..",total)

  // console.log("cart id..",cartid)

  let status;
  if (paymentMethod === "Cod") {
    status = "Pending";
  } else {
    status = "OnlineProcesing";
  }

  const order = new Order({
    user: req.session.user._id,
    cartid: cartid,
    cartitems: products,
    address: address,
    totalPrice: total,
    status: status,
  });
  order
    .save()
    .then(async (order) => {
      console.log("saved order..", order);

      let orderid = order._id;
      var paymentType = order.address.payment;

      console.log("order id from saved order...", orderid);
      console.log("payment type from saved order..", paymentType);

      if (paymentType === "Cod") {
        await Cart.findOneAndRemove({ user: req.session.user });

        var response = {
          id: "cod",
        };

        console.log("response cod id..,", response.id);

        res.json(response);
      } else if (paymentType === "paypal") {
        var response = {
          id: "paypal",
          data: order,
        };

        console.log("response payal id..,", response.id);

        res.json(response);

        console.log("payment type is paypal");
      } else if (paymentType === "razorpay") {
        userHelpers.generateRazorpay(orderid, total).then(async (response) => {
          console.log("checkout raxopay back...", response);

          console.log("response razorpay..id.", response);

          var orderlist = await Order.findByIdAndUpdate(
            { _id: ObjectId(order) },
            {
              status: "payment-failed",
            }
          ).then((order) => {
            console.log("status upadated order from place...", order);
          });

          // data = response;
          //response.data=data;

          var response = {
            id: "razorpay",
            data: response,
          };

          console.log("ff", response);

          res.json(response);
        });
      } else {
        console.log("errorr...");
      }

      // console.log("saved order products..",order.products)
    })
    .catch((err) => {
      console.log("order err..", err);
    });

  //res.json(response)
};

exports.verifyPayment = async (req, res) => {
  console.log("entered verifypayment.....");

  console.log("from post verifypayment..", req.body);
  let details = req.body;
  let orderid = details["order[receipt]"];
  let order_id = details["payment[razorpay_order_id]"];
  let razorpay_payment_id = details["payment[razorpay_payment_id]"];
  let razorpay_signature = details["payment[razorpay_signature]"];

  console.log("ids..", razorpay_payment_id, order_id, razorpay_signature);

  var hmac = crypto.createHmac("sha256", "Q8Np8zqRmJ1GxDArdSfCPu1a");
  hmac.update(order_id + "|" + razorpay_payment_id);

  hmac = hmac.digest("hex");

  if (hmac === razorpay_signature) {
    await Cart.findOneAndRemove({ user: req.session.user });

    console.log("hexa payment sucessfull");

    var orderlist = await Order.findByIdAndUpdate(
      { _id: ObjectId(orderid) },
      {
        status: "placed",
      }
    ).then((order) => {
      console.log("status upadated order...", order);
    });
  } else {
    console.log("payment NOT sucess");
  }

  res.json(approved=true)

};

exports.createOrder = async (req, res) => {
  console.log("from create order for paypal..", req.body);

  const request = new paypal.orders.OrdersCreateRequest();
  let total = req.body.total;
  console.log("total.", total);

  const value = await Convert(total).from("INR").to("USD");
  let price = Math.round(value);

  console.log("price..", price);

  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: price,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: price,
            },
          },
        },
      },
    ],
  });

  try {
    const order = await paypalClient.execute(request);
    console.log("try order..", order);

    console.log("id..", order.result.id);

    res.json({ id: order.result.id });
  } catch (err) {
    console.log("paypal try catch error..", err);
  }
};

exports.paypalOnApprove = async (req, res) => {
  console.log("from paypal on approve..", req.body);
  var orderid = req.body.orderid;

  console.log("orderid..", orderid);

  await Cart.findOneAndRemove({ user: req.session.user });

  var orderlist = await Order.findByIdAndUpdate(
    { _id: ObjectId(orderid) },
    {
      status: "placed",
    }
  ).then((order) => {
    console.log("status upadated order from paypal ...", order);
  });

  res.json(approved=true)

};

exports.removeProFromHis = async (req, res) => {};
