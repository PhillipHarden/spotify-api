import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  ListGroup,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import "../css/SongSearch.css";
import ErrorMessage from "../components/ErrorMessage";

const clientId = "9b8dc26145a04920ac05e65bea4a7f4a";
const clientSecret = "2596ccd0a70446a88f930e04d2c40373";
const baseURI = "https://api.spotify.com/v1";

function SongSearch() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [song, setSong] = useState([]);
  const [otherSongs, setOtherSongs] = useState([]);
  const [noResultsFound, setNoResultsFound] = useState();

  useEffect(() => {
    var param = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    };

    fetch("https://accounts.spotify.com/api/token", param)
      //^ "then" catch the promise that fetch gives me
      .then((results) => results.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);
  //~--------------------------------------------------------------------------------
  //^Search
  async function search() {
    console.log(`Searched for ${searchInput}`);

    //?-search songs---------------------------------------------------------------
    //^ Get the artist ID
    var searchParam = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    var searchSong = await fetch(
      `${baseURI}/search?q=${searchInput}&type=track`,
      searchParam
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.tracks.items[0] == "") {
          setNoResultsFound(true);
        }
        if (data.tracks.items[0] != "") {
          setNoResultsFound(false);
        }
        setSong(data.tracks.items[0]);

        const simSongs = data.tracks.items.filter(myFunction);
        function myFunction(value, index, array) {
          return index > 0;
        }
        console.log(simSongs);
        setOtherSongs(simSongs);
      });
  }
  //^ <<<<<<<<<<<<<<<<<<<<<<<<<<<< end of search() function
  // console.log(noResultsFound.value);

  return (
    <Container className="margin-bottom-custom">
      <div>
        <h1 className="brand-font">Search by Song</h1>
        <InputGroup className="my-3" size="sm">
          <FormControl
            placeholder="Search for song..."
            type="input"
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>Search</Button>
        </InputGroup>
      </div>


      
      <div>
        {song != "" && (
          <div className="song-info d-flex flex-column">
            <h2 className="brand-font h1 my-3">Top Result</h2>
            <div className="song-info-container d-flex ">
              <div>
                <img
                  src={song && song.album.images[0].url}
                  className="top-result-album-image"
                />
              </div>
              <div className="song-info-text my-3">
                <h2 className="d-flex flex-column">
                  <span className="type">Song</span>
                  {song && song.name}
                </h2>
                <p className="d-flex flex-column">
                  <span className="type">Artist</span>
                  {song.artists[0].name}
                </p>
                <p className="d-flex flex-column">
                  <span className="type">Album</span> {song.album.name}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        {/* Display More Songs */}
        {song != "" && (
          <div>
            <h2 className="brand-font h4 my-3">More Songs</h2>
            <ListGroup className="mt-3">
              {otherSongs.map((song, i) => {
                return (
                  <ListGroup.Item
                    key={i}
                    className="song-info-container more-songs-info d-flex my-3"
                  >
                    <div>
                      <img
                        src={song && song.album.images[0].url}
                        className="song-album-image"
                      />
                    </div>
                    <div className="song-info-text my-3">
                      <h2 className="h6 d-flex flex-column">
                        <span className="type">Song</span>
                        {song && song.name}
                      </h2>
                      <p className="d-flex flex-column">
                        <span className="type">Artist</span>
                        {song.artists[0].name}
                      </p>
                      <p className="d-flex flex-column">
                        <span className="type">Album</span>
                        {song.album.name}
                      </p>
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </div>
        )}
      </div>


     



    </Container>
  );
}

export default SongSearch;
