const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username:{
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email:{
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/,"The email address must match."]
    },
    thoughts:[
      {
        type: Scheme.Types.ObjectId,
        ref: 'Thought'
      }
    ],
    friends:[
      {
        type: Scheme.Types.ObjectId,
        ref: 'User' 
      }
    ],
  },
  {
    toJSON: {
      virtuals: true
    },
    id: false
  }
);

userSchema.virtual('friendCount').get(function(){
  return this.friends.length;
});

const User = model('User',userSchema);
module.exports = User