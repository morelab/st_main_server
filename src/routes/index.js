const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelper');
const {
	logIn,
	signUp,
	dashboard,
	logOut,
	checkAuth,
	clearCookie,
	profile,
	deleteProfile,
	changeStatus,
} = require('../controllers/users');
require('../passport/passport');

router
	.route('/login')
	.post(
		validateBody(schemas.authSchema),
		passport.authenticate('local', { session: false }),
		logIn
	);
//* No tiene GUI
router.route('/signup').post(validateBody(schemas.signUpSchema), signUp);

router
	.route('/dashboard')
	.get(passport.authenticate('jwt', { session: false }), dashboard);

router
	.route('/profile')
	.get(passport.authenticate('jwt', { session: false }), profile)
	.delete(passport.authenticate('jwt', { session: false }), deleteProfile);
router
	.route('/logout')
	.post(passport.authenticate('jwt', { session: false }), logOut);

router
	.route('/status')
	.get(passport.authenticate('jwt', { session: false }), checkAuth);

router
	.route('/anon')
	.get(passport.authenticate('jwt', { session: false }), changeStatus);

router.route('/clearCookie').post(clearCookie);

module.exports = router;
