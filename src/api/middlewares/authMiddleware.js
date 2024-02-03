const { verifyToken } = require("../utils/token");
const { decryptRefreshToken } = require("../utils/encryptDecrypt");

module.exports.verifyAccessToken = async (req, res, next) => {

    const token = req.cookies?.access_token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decodedToken = verifyToken({ type: 'access', token });
        req.user = decodedToken;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Unauthorized' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token' });
        } else {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports.verifyRefreshToken = async (req, res, next) => {

    const token = req.cookies?.refresh_token;

    if (!token) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
        const decryptedRF = decryptRefreshToken(token);

        const decodedToken = verifyToken({ type: 'refresh', token: decryptedRF });
        req.user = decodedToken;
        next();
    } catch (err) {
        console.log(err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ success: false, error: 'Invalid token' });
        } else {
            return res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
}

module.exports.csrfProtection = async (req, res, next) => {
    try {
        if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
            return next();
        }
 
        const cookieCsrfToken = req.cookies?._csrf;
        const requestCsrfToken = req.get('x-csrf-token'); 

        if (!requestCsrfToken || !cookieCsrfToken) {
            res.status(401)
                .json({
                    success: false,
                    error: 'Unauthorized'
                });
            return;
        }

        if (requestCsrfToken !== cookieCsrfToken) {
            res.status(403)
                .json({
                    success: false,
                    error: 'Invalid token.'
                });
            return;
        }
        next();
    } catch (e) {
        console.log(e);
        res.status(500).json({ 
            success: false, 
            error: e.message 
        });
        return;
    }
}
