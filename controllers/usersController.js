const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc - Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users)
})

// @desc - Create new users
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body
    //Confirm Data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicates - Noe the collation makes the comparison case-insensitive
    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate Username' })
    }

    // Hash Password
    const hashedPwd = await bcrypt.hash(password, 10)   // 10 salt rounds
    const userObject = { username, "password": hashedPwd, roles }

    //Create and store new user
    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }

})

// @desc - Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body

    // COnfirm Data
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    //Check for duplicate
    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()
    //Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {            // i.e. the duplicate username exists and the id is not the current id being operated on
        return res.status(409).json({ message: 'Duplicate Username' })
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })

})

// @desc - Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID is required for DELETE' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result.id} deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}