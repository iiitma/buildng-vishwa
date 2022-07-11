const { Router } = require('express');
const router = Router(); 
const User = require('../models/User');
const Roles = require("../models/Roles");
const { authorization, checkRole } = require("../utils/auth");
const {error, success} = require('consola');

// Get all users
router.get('/', authorization, checkRole(Roles.ADMIN_LEVEL), async(req, res) => {
    try {
        const users = await User.find({ isApproved: true }, "-hash_password -__v")
        res.send(users);
    } catch (err) {
        error({ message: err, badge: true });
        res.status(500).send({
          message: "Unable to process request. Contact Administrator for support.",
          code: 500,
          error: err
        });
    }
})

// Get all pending users
router.get('/pending', authorization, checkRole(Roles.ADMIN_LEVEL), async(req, res) => {
    try {
        const users = await User.find({ isApproved: false }, "-hash_password -__v")
        res.send(users);
    } catch (err) {
        error({ message: err, badge: true });
        res.status(500).send({
          message: "Unable to process request. Contact Administrator for support.",
          code: 500,
          error: err
        });
    }
});

// Get user By ID
router.get('/:id', authorization, checkRole(Roles.ADMIN_LEVEL), async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.send(user)
    } catch (err) {
        error({ message: err, badge: true });
        res.status(500).send({
          message: "Unable to process request. Contact Administrator for support.",
          code: 500,
          error: err
        });
    }
});

// Approved
router.post('/:id/approve', authorization, checkRole(Roles.ADMIN_LEVEL), async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
            isApproved: true,
        })
        return res.send({
            message: "User Approved",
            code: 200,
          });
    } catch (err) {
        error({ message: err, badge: true });
        res.status(500).send({
          message: "Unable to process request. Contact Administrator for support.",
          code: 500,
          error: err
        });
    }
})

// Update user By ID
router.put('/:id', authorization, checkRole(Roles.ADMIN_LEVEL), async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
           ...req.body
        },{new: true})
        res.send(user)
    } catch (err) {
        error({ message: err, badge: true });
        res.status(500).send({
          message: "Unable to process request. Contact Administrator for support.",
          code: 500,
          error: err
        });
    }
})

// Delete user By ID
router.delete('/:id', authorization, checkRole(Roles.ADMIN_LEVEL), async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        res.send(user)
    } catch (err) {
        error({ message: err, badge: true });
        res.status(500).send({
          message: "Unable to process request. Contact Administrator for support.",
          code: 500,
          error: err
        });
    }
})

module.exports = router