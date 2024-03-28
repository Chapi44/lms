const express=require('express')
const userController =require('../controller/usercontroller')
const {
  authenticateUser,
  authorizePermissions,
} = require("../middelware/authentication");

const router=express.Router()
router.get('/getallusers',
[authenticateUser],
 userController.getAllUsers)
router.get("/getuserById/:id", authenticateUser, userController.getUserById
);
router.post(
  "/delete/:id",
  [authenticateUser, authorizePermissions("access_all")],
  userController.deleteuser
);
router.patch('/update',authenticateUser,userController.updateUser)
router.patch(
  "/updateUserPassword",
  authenticateUser, 
  userController.updateUserPassword
);


module.exports=router