const axios = require('axios');

const src = {
  host: process.env.SRC_HOST,
  apikey: process.env.SRC_APIKEY,
  root: process.env.SRC_ROOT,
};

const dst = {
  host: process.env.DST_HOST,
  apikey: process.env.DST_APIKEY,
  root: process.env.DST_ROOT,
};

const log = (message, title) => {
  const msg = title ? `${title}: ${message}` : message;
  console.log(msg);
  return msg;
};

const addMovie = (json, resolutions) => {
  if (!json.downloaded) {
    return log('Not downloaded. Skipping.', json.title);
  }
  const {
    title, titleSlug, tmdbId, year, movieFile: { quality: { quality: { resolution = '' } } },
  } = json;
  const path = json.path.replace(src.root, dst.root);
  const payload = {
    title,
    titleSlug,
    tmdbId,
    year,
    path,
    qualityProfileId: 1,
    images: [],
    addOptions: {
      searchForMovie: true,
    },
  };
  if (!resolutions.includes(resolution)) {
    return log(`Resolution '${resolution}' is not a synced resolution: ${resolutions}`, title);
  }
  return axios.post(`${dst.host}/api/movie?apikey=${dst.apikey}`, payload)
    .then(() => log('Synced!', title))
    .catch(() => log('Unable to add movie', title));
};

const sync = ({ id, resolutions }) => axios.get(`${src.host}/api/movie/${id}?apikey=${src.apikey}`)
  .then((data) => {
    if (data.message === 'Not Found') {
      return log(`Movie id not found: ${id}`);
    }
    return addMovie(data.data, resolutions);
  });

const importAll = ({ resolutions }) => axios.get(`${src.host}/api/movie?apikey=${src.apikey}`)
  .then(data => data.data.map(d => addMovie(d, resolutions)).filter(movie => movie));

module.exports = { sync, importAll };
