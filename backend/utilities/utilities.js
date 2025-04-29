// const jwt = require("jsonwebtoken")


// function authenticateToken (req , res , next){
//     const authHeader = req.header('Authorization')
//     const token = authHeader && authHeader.split(' ')[1]
//     if (!token) return res.status(401).send('Access denied. No token provided.')
//         try {
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
//     req.user = decoded
//     next()
//     } catch (ex) {
//         res.status(400).send('Invalid token')
//         }


// }

// module.exports = {
//     authenticateToken,
// }

const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    // Get the Authorization header
    const authHeader = req.header('Authorization');

    // Extract the token from the Authorization header
    const token = authHeader && authHeader.split(' ')[1];

    // If no token is found, send a 401 Unauthorized response
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        // Verify the token using the ACCESS_TOKEN_SECRET
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Attach the decoded user data to the request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (ex) {
        // If token is invalid, send a 400 Bad Request response
        res.status(400).send('Invalid token');
    }
}

module.exports = {
    authenticateToken,
};
