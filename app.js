require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  data => {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  data => {
    console.log('Something went wrong when retrieving an access token', err);
  }
);

// Our routes go here:
app.get('/', (request, response) => {
  response.render('home');
  console.log(response);
});

app.get('/artists-search', (request, response) => {
  const artist = request.query.artist;
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      console.log('the received data from the  API: ', data.body.artists.items);
      const artists = data.body.artists.images;
      response.render('artist-search-results', { artists });
    })
    .catch(err =>
      console.log('the error while searching artists occured: ', err)
    );
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
