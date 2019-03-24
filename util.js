const splitUrlParam = (req, param) => req.query[param].split(',');

module.exports = { splitUrlParam };
