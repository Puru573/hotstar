import React, { Component } from 'react'
import {movies} from './getmovies'

export default class Banner extends Component {
  render() {
    let movie=movies.results[0];
    console.log(movies.results[0]);
    return (
      <>
      { movie==""?( //movies empty ho to jbanner aa jaye
           <div className="spinner-border text-danger" role="status">
           <span className="visually-hidden">Loading...</span>
           </div>
      ):( //if not than movies aa jaye
        <div className="banner-card">
        <img src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} className="card-img-top banner-img" alt="..."/>
        {/* <div className="card-body"> */}
          <h5 className="card-title banner-title">{movie.original_title}</h5>
          <p className="card-text banner-overview">{movie.overview}</p>
          {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
          </div>
      //  </div>
  )}

      
     
          
  
     
      </>
 

    )
  }
}
