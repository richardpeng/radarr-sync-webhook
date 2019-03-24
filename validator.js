const validator = (req, res, next) => {
  const params = ['resolutions'];
  for (let i = 0; i < params.length; i += 1) {
    const param = params[i];
    if (req.query[param] === undefined || req.query[param] === '') {
      const message = `Parameter '${param}' is required`;
      console.log(message);
      res.status(400).send(message);
      return;
    }
  }
  next();
};

module.exports = validator;
