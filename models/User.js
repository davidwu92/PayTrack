module.exports = (model, Schema) => {
  const User = new Schema({
      username: { type: String, required:true },
      email: {type: String, required:true, unique:true},
      colorPreferences: [String],
      //NOTES: colorPreferences is an array of color-strings ('red'). Structure looks like this:
      //["red",// colorPreferences[0] will refer to housing.
      // "orange",//colorPreferences[1] will refer to insurance
      // "blue",//...loan
      // "purple",//...taxes
      // "chocolate",//...family
      // "black",//...recreation
      // "green",//...income
      // "grey" //...other/uncategorized]

      events: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
      //IN CASE WE WANT PASSWORD RESET OPTION
      // resetPasswordToken: String,
      // resetPasswordExpires: Date,
      // password: { type: String, require: true},
  })
  User.plugin(require('passport-local-mongoose'))
  
  return model('User', User)
}