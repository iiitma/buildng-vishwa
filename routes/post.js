const { Router } = require("express");
const Post = require("../models/Post");
const router = Router();
const Roles = require("../models/Roles");
const { authorization, checkRole } = require("../utils/auth");
const {error, success} = require('consola');

// Get all published posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({ published: true }, '-__v').populate("authors", '_id firstname lastname username email isBlocked');
    res.send(posts);
  } catch (err) {
    error({ message: err, badge: true });
    res.status(500).send({
      message: "Unable to process request. Contact Administrator for support.",
      code: 500,
      error: err,
    });
  }
});

// Get all writers posts
router.get("/my-posts", authorization, checkRole(Roles.USER), async (req, res) => {
    try {
      const posts = await Post.find({ authors: req.user.id }, '-__v').populate("authors", '_id firstname lastname username email isBlocked');
      res.send(posts);
    } catch (err) {
      error({ message: err, badge: true });
      res.status(500).send({
        message: "Unable to process request. Contact Administrator for support.",
        code: 500,
        error: err
      });
    }
  });

// Create a new post 
router.post('/my-posts', authorization, async(req, res) => {
    try {
        let post = new Post({
          ...req.body,
          published: false,
          authors: (req.body.authors && req.body.authors?.length > 0) ? req.body.authors : [req.user.id]
        });
        post = await post.save();
        return res.send({
            message: "New article created",
            code: 200,
          });
      } catch (err) {
        error({ message: err, badge: true });
        res.status(500).send({
          message: "Unable to process request. Contact Administrator for support.",
          code: 500,
          error: err,
        });
      }
})

// Get post By ID
router.get("/my-posts/:id", authorization, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id, '-__v').populate("authors", '_id firstname lastname username email isBlocked');
    res.send(post);
  } catch (err) {
    error({ message: err, badge: true });
    res.status(500).send({
      message: "Unable to process request. Contact Administrator for support.",
      code: 500,
      error: err,
    });
  }
});

// Publish/UnPublish post By ID
router.put("/my-posts/publish/:id", authorization, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
      published: req.body.published
      },
      { new: true }
    );
    return res.send({
      message: req.body.published ? "Article Published!" : "Article marked as draft!",
      code: 200,
    });
  } catch (err) {
    error({ message: err, badge: true });
    res.status(500).send({
      message: "Unable to process request. Contact Administrator for support.",
      code: 500,
      error: err,
    });
  }
});

// Update post By ID
router.put("/:id", authorization, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
      ...req.body
      },
      { new: true }
    );
    res.send(post);
  } catch (err) {
    error({ message: err, badge: true });
    res.status(500).send({
      message: "Unable to process request. Contact Administrator for support.",
      code: 500,
      error: err,
    });
  }
});

// Delete post By ID
router.delete("/:id", authorization, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    res.send(post);
  } catch (err) {
    error({ message: err, badge: true });
    res.status(500).send({
      message: "Unable to process request. Contact Administrator for support.",
      code: 500,
      error: err,
    });
  }
});

module.exports = router;
