const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const ProfileSchema = require('./profile').schema;
const DeviceSchema = require('./device').schema;
const SmartPlugSchema = require('./smartplug').schema;

const UserSchema = new Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	anonymous: {type: Boolean, required: true},
	profile: { type: ProfileSchema },
	devices: { type: [DeviceSchema] },
	smartplug: { type: SmartPlugSchema },
});

UserSchema.pre('save', async function (next) {
	try {
		const salt = await bcrypt.genSalt(10);
		const passHash = await bcrypt.hash(this.password, salt);
		this.password = passHash;
	} catch (err) {
		next(err);
	}
});

// Compara la contraseña
UserSchema.methods.isValidPassword = async function (newPassword) {
	return await bcrypt
		.compare(newPassword, this.password)
		.catch((err) => new Error(err));
};

const User = model('User', UserSchema);

module.exports = User;
