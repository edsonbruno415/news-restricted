const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const getHash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', async function () {
    this.password = await getHash(this.password);
});

const User = mongoose.model('User', UserSchema);

module.exports = User;