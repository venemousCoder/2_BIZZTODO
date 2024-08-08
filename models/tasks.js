const mongoose = require('mongoose');
const TasksSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User'
    },
    title: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'not started', 'pending'],
      default: 'in-progress'
    }
  },
  {
    timestamps: true,
  }
);

TasksSchema.pre('save', function (next) {
  console.log('validate cb');
  if (!['in-progress', 'completed', 'not started', 'pending'].includes(this.status)) {
    throw new Error('Invalid status name. Must be: in-progress, completed, not started, pending');
  }
  next();
});
// .path('status').validate(function(value) {
//   return ['in-progress', 'completed', 'not started', 'pending'].includes(value)
// }, 'invalid status value')

module.exports = mongoose.model('Tasks', TasksSchema);
