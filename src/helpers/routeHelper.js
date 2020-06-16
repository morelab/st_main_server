const Joi = require('joi');

module.exports = {
	validateBody: (schema) => {
		return (req, res, next) => {
			const result = Joi.validate(req.body, schema);

			if (result.error) return res.status(400).json(result.error);

			if (!req.value) req.value = {};
			req.value['body'] = result.value;
			next();
		};
	},
	schemas: {
		authSchema: Joi.object().keys({
			user: Joi.string().required(),
			pass: Joi.string().required(),
		}),
		signUpSchema: Joi.object().keys({
			user: Joi.string().required(),
			pass: Joi.string().required(),
			anonymous: Joi.boolean().required(),
			profile: Joi.object()
				.keys({
					age: Joi.number(),
					city: Joi.number(),
					big_5: Joi.number(),
					gender: Joi.number(),
					position: Joi.number(),
					barriers: Joi.number(),
					education: Joi.number(),
					intentions: Joi.number(),
					pst_profile: Joi.number(),
					work_culture: Joi.number(),
					pst_self_profile: Joi.number(),
					initiative_to_join: Joi.number(),
				})
				.required(),
			devices: Joi.array()
				.items(
					Joi.object().keys({
						name: Joi.string(),
						in_use: Joi.boolean(),
					})
				)
				.required(),
			smartplug: Joi.object()
				.keys({
					name: Joi.string(),
					in_use: Joi.boolean(),
				})
				.required(),
		}),
	},
};
