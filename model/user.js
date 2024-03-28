const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose
const schema = mongoose.Schema;

const UserSchema = new schema({
  fullname: {
    type: String,
    required: true
},
email: {
    type: String,
    required: true,
    unique: true
},
password: {
    type: String,
    required: true
},

images: {
    type: [String]
},
coursesCreated: [{
    type: Schema.Types.ObjectId,
    ref: 'course'
}],
coursesBought: [{
    type: Schema.Types.ObjectId,
    ref: 'course'
}],
cart: [{
    type: Schema.Types.ObjectId,
    ref: 'course'
}],
totalIncome: {
    type: Number,
    default: 0
},
totalExpenditure: {
    type: Number,
    default: 0
},
  role: {
    type: String,
    enum: ['admin', 'user', 'instructor'],
    default: 'user',
    required: true,
  },
});

UserSchema.pre("save", async function () {
  // console.log(this.modifiedPaths());
  // console.log(this.isModified('name'));
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};


module.exports = mongoose.model("User", UserSchema);
