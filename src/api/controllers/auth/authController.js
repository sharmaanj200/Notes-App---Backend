const User = require('../../models/User');
const bcrypt = require('bcrypt')
const Joi = require('joi');
const { generateAccessToken, generateRefreshToken, generateCSRFToken } = require('../../utils/token');
const { encryptRefreshToken } = require('../../utils/encryptDecrypt');

const userSchema = Joi.object({
    fullName: Joi.string().trim().regex(/^[a-zA-Z\s]+$/).min(3).required().messages({
        'string.pattern.base': 'Full name must contain only letters',
        'string.min': 'Full name must be at least 3 characters long',
        'any.required': 'Full name is required'
    }),
    email: Joi.string().trim().email().lowercase().required().messages({
        'string.email': 'Invalid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[#?!@$%^&*-])[A-Za-z\\d#?!@$%^&*-]{8,}$'
        ))
        .required()
        .messages({
            'string.base': 'Password must be a string',
            'string.empty': 'Password is required',
            'string.pattern.base': 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@ $ ! % * ? &)',
            'string.min': 'Password must be at least 8 characters long',
            'any.required': 'Password is required'
        })
});

module.exports.signup_user = async (req, res) => {
    try {

        const { error, value } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, error: error.details[0].message });
        }

        const {
            fullName,
            email,
            password
        } = value;

        const isEmailexists = await User.findOne({ email });

        if (isEmailexists) {
            return res.status(409).json({
                status: 409,
                message: "A user with this email address already exists."
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = new User({
            fullName,
            email,
            password: hashPassword,
        });

        const token = generateAccessToken({ userId: user._id, email, role: 'user' });
        const refreshToken = generateRefreshToken({ userId: user._id, email, role: 'user' });
        const csrfToken = generateCSRFToken();
        const encryptedRF = encryptRefreshToken(refreshToken);

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 60 * 60 * 1000
        });
        res.cookie('_csrf', csrfToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 15 * 24 * 60 * 60 * 1000
        });
        res.cookie('refresh_token', encryptedRF, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 15 * 24 * 60 * 60 * 1000
        });

        user.refreshToken = encryptedRF;

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'User registered successfully',
            data: {
                email,
                csrfToken
            }
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            error: e.message
        });
    }
}

const userLoginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required()
});

module.exports.login_user = async (req, res) => {

    try {

        const { error, value } = userLoginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { email, password } = value;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid login credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({
                status: 400,
                message: "Invalid login credentials"
            });
        }

        const role = user.role;

        const token = generateAccessToken({ userId: user._id, email, role });
        const refreshToken = generateRefreshToken({ userId: user._id, email, role });
        const encryptedRF = encryptRefreshToken(refreshToken);
        const csrfToken = generateCSRFToken();

        await User.updateOne({ email }, { refreshToken: encryptedRF });

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 60 * 60 * 1000
        });
        res.cookie('_csrf', csrfToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 15 * 24 * 60 * 60 * 1000
        });
        res.cookie('refresh_token', encryptedRF, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 15 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: 'Login successfull',
            data: { email, csrfToken }
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, error: err.message });
    }
}

module.exports.logout_user = async (req, res) => {
    try {
        res.clearCookie('access_token');
        res.clearCookie('_csrf');
        res.clearCookie('refresh_token');

        res.status(200).json({
            success: true,
            message: 'User successfully logged out',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'An internal server error occurred',
        });
    }
}

module.exports.refresh_token = async (req, res) => {
    try {

        const { userId, email } = req.user;

        const token = generateAccessToken({ userId, email });

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 60 * 60 * 10000
        });

        return res.status(200).json({
            success: true,
            message: 'Token refreshed successfully'
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}
