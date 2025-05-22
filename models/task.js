const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({  // For tracking user analytics
  title: String,
  subject: String,
  dueDate: Date,
  priority: { type: String, enum: ['High', 'Medium', 'Low'] },
  description: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
module.exports=mongoose.model('Task',TaskSchema);