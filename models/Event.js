module.exports = (model, Schema) => {
  const Event = new Schema({
      title: String,
      groupId: String,
      amount: Number,
      isPayment: Boolean,
      frequency: String,
      website: String,
      category: String,
      notes: String,
      date: { type: Date },
      // endingDate: {type: Date },
      author: {
        type: Schema.Types.ObjectId, ref: 'User'
      }
  })
  return model('Event', Event)
}