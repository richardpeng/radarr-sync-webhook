const splitUrlParam = (req, param) => req.query[param].split(',');

const getUrlParam = (req, param) => {
  console.log(req.query);
  return req.query[param];
};

module.exports = { splitUrlParam, getUrlParam };
