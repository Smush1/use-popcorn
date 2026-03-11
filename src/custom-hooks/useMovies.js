import { useState, useEffect } from "react";


const KEY='3eefbb5'

export function useMovies(query, callback){
    
    
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    
      useEffect(function (){

      callback?.()
    
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
    
    
     //setSelectedId('')
      fetchMovies()
      
    
      return function(){
        controller.abort();
      }
      },[query, callback])

      return {movies, isLoading, error }
}