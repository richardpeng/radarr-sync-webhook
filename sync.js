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

const log = (title, message) => {
  console.log(`${title}: ${message}`);
};

const addMovie = (json) => {
  if (!json.downloaded) {
    log(json.title, 'Not downloaded. Skipping.');
    return false;
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
  const regex = /\d+/;
  if (!regex.test(resolution) || parseInt(resolution.match(regex)[0], 10) <= 1080) {
    log(title, 'Not a UHD video');
    return false;
  }
  return axios.post(`${dst.host}/api/movie?apikey=${dst.apikey}`, payload)
    .then(() => {
      log(title, 'Synced!');
      return title;
    })
    .catch(() => {
      log(title, 'Unable to add movie');
    });
};

const sync = id => axios.get(`${src.host}/api/movie/${id}?apikey=${src.apikey}`)
  .then((data) => {
    if (data.message === 'Not Found') {
      console.log(`Movie id not found: ${id}`);
      return false;
    }
    return addMovie(data.data);
  });

const importAll = () => axios.get(`${src.host}/api/movie?apikey=${src.apikey}`)
  .then(data => data.data.map(addMovie).filter(movie => movie));

module.exports = { sync, importAll };
