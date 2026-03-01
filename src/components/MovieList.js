import Movie from './Movie'

export default function MoviesList({movies, onSetSelectedId}){
  return(
        <ul className="list list-movies">
          {movies?.map((movie, i) => <Movie movie={movie} key={i} onSetSelectedId={onSetSelectedId}/>)}
        </ul>
  )
}