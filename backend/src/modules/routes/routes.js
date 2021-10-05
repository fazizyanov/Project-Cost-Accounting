const express = require('express');
const router = express.Router();

const {
  getAllExpenses,
  createNewExp,
  changeExp,
  deleteExp,
} = require('../controllers/task.controller');

// Tasks routes
router.get('/getAllExpenses', getAllExpenses);
router.post('/createNewExp', createNewExp);
router.patch('/changeExp', changeExp);
router.delete('/deleteExp', deleteExp);

//User routes

module.exports = router;