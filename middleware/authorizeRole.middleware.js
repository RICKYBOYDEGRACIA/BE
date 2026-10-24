const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        console.log(req)
        if(!req.role || req.role !== requiredRole){
            return res.status(403).json({
                message: 'Access forbidden: Insufficient permission'
            });
        }
        next();
    }
}

module.exports = {
    authorizeRole
}