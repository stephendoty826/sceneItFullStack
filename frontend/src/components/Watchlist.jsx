import React, { useState, useEffect } from 'react'
import CardList from './CardList';
import axios from 'axios';

const Watchlist = () => {

  const [movieArray, setMovieArray] = useState([])

  useEffect(() => {
    fetch("https://sceneitbackend.onrender.com/watchlist")
      .then((response) => {
        return response.json();
      })
      .then((imdbIDArray) => {
        // fetchWatchlistData function call and pass in response
        fetchWatchlistData(imdbIDArray);
      });
  }, [])

  async function fetchWatchlistData(imdbIDArray){ // form for imdbIDArray is [{imdbID: "tt32345"}, {imdbID: "tt35545"}]
    // map through imdbIDArray and collect all the promises for each fetch
    let promisesArray = imdbIDArray.map(async imdbIDObj => {
      let imdbID = imdbIDObj.imdbID
      let response = await axios.get(`http://www.omdbapi.com/?apikey=c308ac58&i=${imdbID}&plot=full`)
      return response.data
    })

    // pass promisesArray to Promise.all() and get data back from API
    let tempMovieArray = await Promise.all(promisesArray)

    // set movieArray to tempMovieArray
    setMovieArray(tempMovieArray)
  }

  function handleDeleteClick(imdbID) {
    // fetch to delete movie from database
    fetch(`https://sceneitbackend.onrender.com/watchlist/${imdbID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "applications/json",
      },
    })
      .then((response) => response.json())
      .then((response) => console.log(response));

    // deletes movie from frontend state
    let tempMovieArray = movieArray.filter(movie => movie.imdbID !== imdbID)
    setMovieArray(tempMovieArray)
  }

  const deleteBtnDetails = {
    onClick: handleDeleteClick,
    role: "delete",
    type: "button",
  };

  return (
    <div className="container">
      <div className="col-12 header text-center mb-3">
        <h1 style={{color: "black"}}>My Watchlist</h1>
        <CardList btnDetails={deleteBtnDetails} movieArray={movieArray}/>
      </div>
    </div>
  )
}

export default Watchlist