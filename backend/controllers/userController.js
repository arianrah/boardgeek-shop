import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'

//@desc   auth user (validate email/pw) + get token
//@route  POST /api/users/login
//@access public
const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const user = await User.findOne({ email: email })

	if (user && (await user.matchPassword(password))) {
		res.json({
			name: user.name,
			email: user.email,
			token: generateToken(user._id),
		})
	} else {
		res.status(401)
		throw new Error('Invalid Email or Password')
	}
})

//@desc   get user (logged in auth)
//@route  GET /api/users/profile
//@access public
const getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id)
	console.log(user)
	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		})
	} else {
		res.status(400)
		throw new Error('User not found')
	}
})

export { authUser, getUserProfile }
