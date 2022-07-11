const { Router } = require("express");
const router = Router();
const { authorization } = require("../utils/auth");

// Get all dashboards
router.get("/:role", authorization, async (req, res) => {
  if (req.params.role !== req.user.role.toLowerCase()) {
    return res.status(401).json({
      message: `${req.params.role} not found`,
      code: 401,
    });
  }
  return res.json({
    message: `Your role is ${req.params.role}`,
    code: 200,
  });
  // try {
  //     const dashboards = await Dashboard.find()
  //     res.send(dashboards)
  // } catch (error) {
  //     res.status(500).send(error.message)
  // }
});

// // Create a new dashboard
// router.post('/', Authorization, async(req, res) => {
//     try {
//         let dashboard = new Dashboard({
//             key:value
//         })
//         dashboard = await dashboard.save()
//         res.send(dashboard)
//     } catch (error) {
//         res.status(500).send(error.message)
//     }
// })

// // Get dashboard By ID
// router.get('/:id', Authorization, async(req, res) => {
//     try {
//         const dashboard = await Dashboard.findById(req.params.id)
//         res.send(dashboard)
//     } catch (error) {
//         res.status(500).send(error.message)
//     }
// })

// // Update dashboard By ID
// router.put('/:id', Authorization, async(req, res) => {
//     try {
//         const dashboard = await Dashboard.findByIdAndUpdate(req.params.id, {
//             key:value
//         },{new: true})
//         res.send(dashboard)
//     } catch (error) {
//         res.status(500).send(error.message)
//     }
// })

// // Delete dashboard By ID
// router.delete('/:id', Authorization, async(req, res) => {
//     try {
//         const dashboard = await Dashboard.findByIdAndDelete(req.params.id)
//         res.send(dashboard)
//     } catch (error) {
//         res.status(500).send(error.message)
//     }
// })

module.exports = router;
