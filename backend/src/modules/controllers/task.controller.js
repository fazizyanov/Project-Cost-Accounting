//const { v4: uuidv4 } = require('uuid');
const Expenses = require('../../models/tasks');


module.exports.getAllExpenses = async (req, res, next) => {
  Expenses.find({}).then(result => {
    res.send({data: result})
  });
};

module.exports.createNewExp = (req, res, next) => {
  const body = req.body;
  if (body.hasOwnProperty('text') && body.hasOwnProperty('price')) {
    const expenses = new Expenses(body);
    expenses.save().then(result => {
      Expenses.find({}).then(result => {
        res.send({data: result});
      })
    })
  } else {
    res.status(422).send('Error! Params not correct');
  }
};

module.exports.changeExp = (req, res, next) => {
  const body = req.body;
  if (body.hasOwnProperty('_id') && (body.hasOwnProperty('text') || body.hasOwnProperty('price'))) {
    Expenses.updateOne({_id: req.body._id}, {text: req.body.text, price: req.body.price}).then(result => {
      Expenses.find({}).then(result => {
        res.send({data: result});
      })
    })
  } else {
    res.status(422).send('Error! Params not correct');
  }
};

module.exports.deleteExp = (req, res, next) => {
  Expenses.deleteOne({_id: req.query._id}).then(result => {
    Expenses.find({}).then(result => {
      res.send({data: result});
    })
  })
};

