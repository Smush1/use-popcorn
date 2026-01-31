import { useEffect, useState } from "react";
import StarRating from './StarRating';
 
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY='3eefbb5'

export default function App() {

  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

   const [query, setQuery] = useState('');
   const [selectedId, setSelectedId] = useState(null)

/* useEffect(function(){
  console.log('After every re render')
})

useEffect(function(){
  console.log('Render on first time execution only')
},[])

  console.log('During render') */




  useEffect(function (){
    async function fetchMovies(){

 try {  
   setIsLoading(true)
   setError('')
   const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`);
   if (!res.ok) throw new Error(`(${res.status}!) Failed to fetch `);
   const data = await res.json(); 
   if (data.Response === "False" )
    throw new Error ('Movie Not Found')

    setMovies(data.Search)
    console.log(data.Search)

  }

    catch(err){
      console.error(err.message)
      setError(err.message)
    }

    finally{
      setIsLoading(false)
    }
  }

  if(query.length < 3 ){
    setError('');
    setMovies([]);
    return
  }

  fetchMovies()
  },[query])

  return (
    <>

      <Header> 
        <Search query={query} onSetQuery={setQuery} />
        <NumResults movies={movies}/>
      </Header>

      <Main>
        <Box>
          { !isLoading && !error && <MoviesList movies={movies} selectedId={selectedId} onSetSelectedId={setSelectedId} />}
          { error && <ErrorMessage message={error} />} 
          {isLoading && <Loader /> }
        </Box>
        <Box>
            {selectedId ? <MovieDetails selectedId={selectedId} onCloseMovie={setSelectedId} /> :
            <>
            <WatchedSummary watched={watched} />
            <WatchedMoviesList  watched={watched} />
            </>
            }
        </Box>
{     /*         
<Box element={<MoviesList movies={movies} />}/>
        <Box element={ 
          <>
          <WatchedSummary watched={watched} />
          <WatchedMoviesList  watched={watched} />
          </> } /> */}
      </Main>
    </>
  );
}


function Loader(){
  return <div className="loader">Loading...</div>
}

function ErrorMessage({message}){
  return <p className="error">🛑{message}</p>
}

function Header({ children }){

  return (
      <nav className="nav-bar">
        <Logo />
        {children}
      </nav>)
}



function Logo(){
       return (  
       <div className="logo">
          <span role="img">🍿</span>
          <h1>usePopcorn</h1>
      </div>)
}


function Search({query, onSetQuery}){

 

  return (
  <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onSetQuery(e.target.value)}
        />)
}

function NumResults({movies}){
    return <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
} 




function Main({children}){
  return (
  <main className="main">
    {children}
  </main>)
}


function Box({children}){
  const [isOpen, setIsOpen] = useState(true);

  return(
          <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? "–" : "+"}
          </button>
          {isOpen && children }
        </div>)
}


/* function WatchedMoviesBox(){
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen2, setIsOpen2] = useState(true);

  return(
  <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen2((open) => !open)}
          >
            {isOpen2 ? "–" : "+"}
          </button>
          {isOpen2 && (             
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList  watched={watched} />
            </> )}
        </div>
  )
} */


function MovieDetails({selectedId, onCloseMovie}){

  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    Genre: genre,
  } = movie

  console.log(title, year)
  useEffect(function(){

    try{
      setIsLoading(true)
      async function getMovieDetails(){
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
      const data = await res.json(); 
      console.log(data)
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


  function handleCloseMovie(){
    onCloseMovie('')
  }

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
        <StarRating maxRating={10} size={24}/>
      </div>
      <p>
        <em>{plot}</em>
      </p>
      <p>Starring: {actors}</p>
      <p>Directed by {director}</p>
    </section>

  </div>)
}




function MoviesList({movies, onSetSelectedId}){
  return(
        <ul className="list list-movies">
          {movies?.map((movie, i) => <Movie movie={movie} key={movie.imdbID} onSetSelectedId={onSetSelectedId}/>)}
        </ul>
  )
}

function Movie({movie, selectedId, onSetSelectedId}){
      function handleSelected(id){
        onSetSelectedId((selectedId)=> id === selectedId ? null : id);
      }

      return ( 
      <li key={movie.imdbID} onClick={()=>handleSelected(movie.imdbID)} style={{cursor: 'pointer'}}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
            <span>{movie.Year}</span>
            </p>
          </div>
      </li>
      )
}


function WatchedSummary({watched}){



  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));


  return (
    <div className="summary">
      <h2>Movies you watched</h2>
                <div>
                  <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                  </p>
                  <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating}</span>
                  </p>
                  <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                  </p>
                  <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                  </p>
                </div>
              </div>
  )
}

function WatchedMoviesList({watched}){
  return (
        <ul className="list">
                {watched.map((movie) => ( <WatchedMovie movie={movie} key={movie.imdbID} />))}
              </ul>
  )
}

function WatchedMovie({movie}){
  return(
      <li key={movie.imdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>
          </div>
      </li>
  )
}