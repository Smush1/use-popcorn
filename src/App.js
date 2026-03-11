import { useRef, useState } from "react";

import Box from './components/Box'

import MovieDetails from "./components/MovieDetails";
import MoviesList from "./components/MovieList";
import Loader from "./components/Loader";


import WatchedSummary from "./components/WatchedSummary";
import WatchedMoviesList from "./components/WatchedMovieList";
import { useMovies } from "./custom-hooks/useMovies";
import { useLocalStorageState } from "./custom-hooks/useLocalStorage";
import { useKey } from "./custom-hooks/useKey";

 
//const KEY='3eefbb5'

export default function App() {
  
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null)


  const {movies, isLoading, error } = useMovies(query, setSelectedId)


  const [watched, setWatched] = useLocalStorageState([], "watched");


//  const [watched, setWatched] = useState([]);
  // const [watched, setWatched] = useState(function(){
    
  //   const storedValue = localStorage?.getItem('watched')
  //   if (storedValue === null) return []
  //   else
  //   return JSON.parse(storedValue)
  // });

  
  
  function handleDeleteWatched(id){
    setWatched((watched) => watched.filter((movie)=> movie.imdbID !== id ))
  }

  

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

  const inputEl = useRef(null)
  //  Not a react way to things and NOT to selectDOM elements

// useEffect(function(){
//  const el = document.querySelector('.search')
//  console.log(el)
//  el.focus()
// },[])



useKey( "Enter", function(){
  if (document.activeElement === inputEl.current) return;
  onSetQuery('')
  inputEl.current.focus()
})

// useEffect(function(){
//   function callback(e){
//   //console.log(e)
//     if (document.activeElement === inputEl.current) return;
//   if(e.code === "Enter"){
//   onSetQuery('')
//   inputEl.current.focus()
//     }
//   }


//   document.addEventListener('keydown', callback)
//   return document.addEventListener('keydown', callback)
// },[onSetQuery])


  return (
  <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onSetQuery(e.target.value)}
      ref={inputEl}
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











