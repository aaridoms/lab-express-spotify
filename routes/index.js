const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const router = express.Router();

require('dotenv').config();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

router.get("/", (req, res, next) => {
    res.render("home");
});

router.get("/artist-search", async (req, res, next) => {
    // console.log(req.query.search)

    const searchArtist = async (api) => {
      try {
        const artist = await api.searchArtists(req.query.search)

        console.log(artist.body.artists.items)

        res.render("artist-search-results", {
            artist: artist.body.artists.items 
        })
        
      } catch (error) {
        console.log(error)
      }
    } 

    await searchArtist(spotifyApi)
});

router.get("/albums/:artistId", async (req, res, next) => {

    const searchArtistAlbums = async (api) => {
      try {
        const albums = await api.getArtistAlbums(req.params.artistId)

        console.log(albums.body.items)

        res.render("albums", {
            albums: albums.body.items
        })
      } catch (error) {
        console.log(error)
      }
    }

    await searchArtistAlbums(spotifyApi)
})

router.get("/albums/:albumId/tracks", async (req, res, next) => {
  
    const searchAlbumTracks = async (api) => {
      try {
        const tracks = await api.getAlbumTracks(req.params.albumId)
        
        console.log(tracks.body.items)

        res.render("album-tracks", {
            tracks: tracks.body.items
        })

      } catch (error) {
        console.log(error)
      }
    }

    await searchAlbumTracks(spotifyApi)
})

module.exports = router;
