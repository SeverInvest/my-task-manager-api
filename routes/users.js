const router = require("express").Router();
const { userValidate } = require("../middlewares/validation");
const { getCurrentUser, updateUserInfo, getUsers } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", userValidate, updateUserInfo);

module.exports = router;
