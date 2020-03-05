module.exports = (model, Schema) => {
  const Payment = new Schema({
      title: String,
      // frequency: Number,
      // amount: Number,
      // category: String,
      // website: String,
      // startingDate: { type: Date, default: Date.now },
      // notes: String,
      author: {
        type: Schema.Types.ObjectId, ref: 'User'
      }
  })
  return model('Payment', Payment)
}