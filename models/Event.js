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
      groupEndDate: {type: Date},
      eventNumber: Number, //Each event, in a group of 10 events, will have eventNumber 1-10
      groupTotal: Number, //One year of weekly events will have groupTotal 52.
      author: {
        type: Schema.Types.ObjectId, ref: 'User'
      }
  })
  return model('Event', Event)
}