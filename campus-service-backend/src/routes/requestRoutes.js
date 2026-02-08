const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");

const {
  createRequest,
  getAllRequests,
  assignRequest,
  startWork,
  closeRequest,
  rejectRequest,
  deleteRequest,
} = require("../controllers/requestController");


// 🟢 CREATE (student)
router.post("/", auth, createRequest);

// 🟢 GET ALL (role based)
router.get("/", auth, getAllRequests);

// 🟢 ADMIN ASSIGN
router.put("/assign/:id", auth, assignRequest);

// 🟢 STAFF START
router.put("/start/:id", auth, startWork);

// 🟢 STAFF CLOSE
router.put("/close/:id", auth, closeRequest);

// 🟢 STAFF REJECT
router.put("/reject/:id", auth, rejectRequest);

// 🟢 ADMIN DELETE
router.delete("/:id", auth, deleteRequest);


module.exports = router;
