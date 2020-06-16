const jwt = require('jsonwebtoken');

const User = require('../models/user');

signToken = (user) => {
	return jwt.sign(
		{
			iss: 'Morelab',
			sub: user.id,
			iat: new Date().getTime(),
			exp: new Date().setDate(new Date().getDate() + 1),
		},
		process.env.JWT_SECRET
	);
};

module.exports = {
	signUp: async (req, res, next) => {
		const {
			user,
			pass,
			anonymous,
			profile,
			devices,
			smartplug,
		} = req.value.body;
		const checkUser = await User.findOne({ username: user });
		if (checkUser) return res.status(403).send({ err: 'El usuario existe' });

		const newUser = new User({
			username: user,
			password: pass,
			anonymous: anonymous,
			profile: profile,
			devices: devices,
			smartplug: smartplug,
		});
		await newUser.save();

		const token = signToken(newUser);
		res.cookie('access_token', token, {
			httpOnly: true,
		});
		res.status(200).json({ success: true });
	},

	logIn: async (req, res, next) => {
		const token = signToken(req.user);
		res.cookie('access_token', token, {
			httpOnly: true,
		});
		res.status(200).json({ success: true });
	},

	dashboard: async (req, res, next) => {
		const username = req.user.username;
		const devices = req.user.devices;
		const smartplug = req.user.smartplug;
		const user = { username, devices, smartplug };
		//TODO: Cargar datos de los gráficos y quitar usuario
		res.json({
			secret: 'Data',
			user: user,
		});
	},

	profile: async (req, res, next) => {
		var username;
		if (req.user.anonymous === false) {
			username = req.user.username;
		} else {
			username = req.user.smartplug.name;
		}
		const devices = req.user.devices;
		const anonymous = req.user.anonymous;
		const smartplug = req.user.smartplug;
		const user = { username, anonymous, devices, smartplug };
		res.json({
			user: user,
		});
	},
	deleteProfile: async (req, res, next) => {
		await User.findOneAndDelete(req.user.username);
		await res.clearCookie('access_token');
		return res.json({ success: true });
	},
	changeStatus: async (req, res, nex) => {
		var anonymous = !req.user.anonymous;
		await User.findByIdAndUpdate(
			req.user.id,
			{
				anonymous,
			},
			{ new: true }
		);
		res.json({ success: true });
	},

	logOut: async (req, res, next) => {
		await res.clearCookie('access_token');
		res.json({ success: true });
	},

	checkAuth: async (req, res, next) => {
		res.json({
			success: true,
		});
	},

	clearCookie: async (req, res, next) => {
		await res.clearCookie('access_token');
		res.json({ success: true });
	},
};
