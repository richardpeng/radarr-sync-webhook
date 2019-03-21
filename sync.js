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

const addMovie = (json) => {
  if (!json.downloaded) {
    console.log('Not downloaded');
    return;
  }
  const {
    title, titleSlug, tmdbId, year, movieFile: { quality: { quality: { resolution = '' } } },
  } = json;
  const regex = /\d+/;
  if (!regex.test(resolution) || parseInt(resolution.match(regex)[0], 10) <= 1080) {
    console.log('Not a UHD video');
    return;
  }
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
  return axios.post(`${dst.host}/api/movie?apikey=${dst.apikey}`, payload)
    .then((data) => {
      console.log(data.data);
      return data.data.title;
    })
    .catch((err) => {
      // TODO: make this output more info about movie
      console.log('Unable to add movie');
    });
};

const sync = id => axios.get(`${src.host}/api/movie/${id}?apikey=${src.apikey}`)
  .then((data) => {
    if (data.message === 'Not Found') {
      console.log('Not found');
      return;
    }
    return addMovie(data.data);
  });

const importAll = () => axios.get(`${src.host}/api/movie?apikey=${src.apikey}`)
  .then((data) => {
    const response = data.data.map(addMovie).filter(movie => movie);
    return response;
  });

module.exports = { sync, importAll };
