import { useEffect, useState } from "react";

import Box from './components/Box'

import MovieDetails from "./components/MovieDetails";
import MoviesList from "./components/MovieList";
import Loader from "./components/Loader";


import WatchedSummary from "./components/WatchedSummary";
import WatchedMoviesList from "./components/WatchedMovieList";

 
/* const tempMovieData = [
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
 */


const KEY='3eefbb5'



export default function App() {

  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
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

  
  function handleAddWatched(movie){
    setWatched((watched) => [...watched, movie] )
  }
  
  function handleDeleteWatched(id){
    setWatched((watched) => watched.filter((movie)=> movie.imdbID !== id ))
  }

  useEffect(function (){

    const controller = new AbortController();
  
  async function fetchMovies(){

 try {  
   setIsLoading(true)
   setError('')
   const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`, 
    {signal: controller.signal });
   if (!res.ok) throw new Error(`(${res.status}!) Failed to fetch `);
   const data = await res.json(); 
   if (data.Response === "False" )
    throw new Error ('Movie Not Found')

  setMovies(data.Search)
  setError('')
 //   console.log(data.Search)

  }

    catch(err){
      //console.error(err.message)

      if (err.name !== "AbortError"){
      setError(err.message)
    }
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


  setSelectedId('')
  fetchMovies()
  

  return function(){
    controller.abort();
  }
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
            {selectedId ? <MovieDetails 
                          selectedId={selectedId} 
                          onCloseMovie={setSelectedId} 
                          onAddWatched={handleAddWatched}
                          watched={watched}
                          /> :
            <>
            <WatchedSummary watched={watched} />
            <WatchedMoviesList  watched={watched}  onDeleteWatched ={handleDeleteWatched}/>
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











