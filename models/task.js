const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const taskSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    default: 'Backlog',
  },
  tags: [{ type: String }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'TaskUser',
  },
  deadline: {
    type: Date,
  },
 atCreated: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model('Task', taskSchema);
