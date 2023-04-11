const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// const routeSchema = new mongoose.Schema({
//   startLocation: { type: String, required: true },
//   endLocation: { type: String, required: true },
//   date: { type: Date, default: Date.now }
// });

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
    // routesSaved: [routeSchema]
});  

UserSchema.pre('save', async function(next) {
    const user = this;

    if (!user.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
    next();
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
