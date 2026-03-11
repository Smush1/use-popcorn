import { useState, useEffect, useRef } from "react";
import StarRating from "../StarRating";
import Loader from "./Loader";
import { useKey } from "../custom-hooks/useKey";



export default function MovieDetails({selectedId, onCloseMovie, onAddWatched , watched }){

  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating ] = useState(false)


  const countRef = useRef(0)

  useEffect(()=>{
    if (userRating)
    countRef.current =  countRef.current + 1
  },[userRating])

  const KEY='3eefbb5'

  const isWatched = watched.map(movie => movie.imdbID).includes(selectedId)
  //console.log(isWatched)

  const watchedUserRating = watched.find((movie) => (movie.imdbID === selectedId))?.userRating;


  const { 
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
  } = movie


  /* eslint-disable */
  //if( imdbRating > 8) [istop, setIsTop] = useState(true)



  function handleAdd(){
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingNumbers: countRef.current
    };

   // console.log(newWatchedMovie)

    onAddWatched(newWatchedMovie)
       onCloseMovie('')
  }

 function handleCloseMovie(){
    onCloseMovie('')
  }


useKey( "Escape", onCloseMovie )



useEffect(function(){
  if(!title) return ;


  document.title = `Movie | ${title}`;

  return function(){
    document.title = 'usePopcorn';
   // console.log("Clean up the useEffect with"+ title )
  }
},[title])






  // console.log(title, year)
  useEffect(function(){

    try{
      setIsLoading(true)
      async function getMovieDetails(){
      const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
      const data = await res.json(); 
      //console.log(data)
      setMovie(data)
      setIsLoading(false)
    }

      getMovieDetails()
  }
  catch(err){
    console.error(err)
  }
  finally{
  }


  },[selectedId])




  return (
  isLoading ? 
  < Loader /> :
  <div className="details">
    <header>
    <button className="btn-back" onClick={handleCloseMovie}> &larr;</button>
    <img src={poster} alt={`Poster of ${movie} movie`} />
    <div className="details-overview">
      <h2>{title}</h2>
      <p>{released} &bull; {runtime}</p>
      <p>
        <span>⭐</span>
        {imdbRating} IMDb rating
      </p>
    </div>
    </header>

    <section>
      <div className="rating">
      {
        (!isWatched )?
      <>
        <StarRating maxRating={10} size={24} onSetRating={setUserRating}/>
        {userRating && <button className="btn-add" onClick={handleAdd} > + Add to list </button>}
      </> :
      <p>You already rated <span>{watchedUserRating}⭐ </span> this movie</p> 
      }
      </div>
      <p>
        <em>{plot}</em>
      </p>
      <p>Starring: {actors}</p>
      <p>Directed by {director}</p>
    </section>

  </div>)
}









