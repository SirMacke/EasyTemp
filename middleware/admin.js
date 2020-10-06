module.exports = function (req, res, next) {
    // 401 Unauthorized - Wrong key, try again
    // 403 Forbidden - You can't access this with your key
  
    if (!req.user.isAdmin) return res.status(403).send('Access denied.');
  
    next();
}