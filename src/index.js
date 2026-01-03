import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
/* import './index.css';
import App from './App'; */

import StarRating from './StarRating';


function Test(){
  const [movieRating, setMovieRating] = useState(0)

  return (<>
  <StarRating maxRating={10} onSetRating={setMovieRating} />
  <p> This movie is {movieRating} rating star </p>
  </>
)
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  {/*   <App /> */}
  <StarRating maxRating={'aldfkjld'} defaultRating={'afdad'}/>
  <StarRating maxRating={5} color='red' size='28' className='test' messages={['Terrible', 'Bad', 'Average', 'Good', 'Amazing']} />
  <Test />
  </React.StrictMode>
);
