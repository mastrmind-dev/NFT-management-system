exports.verifyToken = (req, res, next) => {
    //get auth header value
    const bearerHeader = req.headers['authorization']
    // check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // FORMAT OF THE AUTHERIZATION TOKEN = Bearer <access_token>
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        //set token
        req.token = bearerToken
        // next middleware
        next()
    } else {
        // forbidden
        res.sendStatus(403);
    }
}