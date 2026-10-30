const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        const userRole = req.user ? req.user.role : undefined;
        
        if (!userRole || userRole !== requiredRole) {
            return res.status(403).json({
                message: 'Access forbidden: Insufficient permission'
            });
        }
        next();
    }
}

module.exports = { authorizeRole };