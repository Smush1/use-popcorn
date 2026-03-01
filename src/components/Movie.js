export default function Movie({movie, selectedId, onSetSelectedId}){
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