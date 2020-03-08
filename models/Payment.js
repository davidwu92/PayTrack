module.exports = (model, Schema) => {
  const Payment = new Schema({
      title: String,
      groupId: String,
      amount: Number,
      isPayment: Boolean,
      frequency: Number,
      website: String,
      category: String,
      notes: String,
      startingDate: { type: Date },
      endingDate: {type: Date },
      author: {
        type: Schema.Types.ObjectId, ref: 'User'
      }
  })
  return model('Payment', Payment)
}