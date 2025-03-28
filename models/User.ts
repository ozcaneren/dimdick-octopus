import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email zorunludur'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Şifre zorunludur'],
    minlength: 6,
  },
  name: {
    type: String,
    required: [true, 'İsim zorunludur'],
  },
  avatar: {
    type: String,
    default: '/avatars/default.png', // Varsayılan avatar
  },
}, { timestamps: true });

// Şifreyi hashleme
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Şifre karşılaştırma metodu
userSchema.methods.matchPassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User; 