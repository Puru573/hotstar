import React, { Component } from 'react'
// import {movies} from './getmovies'
import axios from 'axios';
export default class List extends Component {
    constructor(){
        super();
        console.log("constructor is called");
        this.state={
            hover:"",
            parr:[1],//ab tak me konse page pr hu
            currPage:1,
            movies:[],
            fm:[],//this will store the id of movies added to favourites
        }
    }
    handleEnter=(id)=>{
        this.setState({
            hover:id,
        })
    }
    handleLeave=()=>{
        this.setState({
            hover:'',
        })
    }
    changeMovies= async ()=>{
           console.log("changeMovies is called");
           let res=await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=a70924997e02110adcecdf0c4fa26bff&language=en-US&page=${this.state.currPage}`);
           // console.log(res.data);
           this.setState({
             movies:[...res.data.results]//movies ke obj honge[{},{},{}]
           })
    }
    handleNext=()=>{
        let tempArr=[];
        for(let i=1;i<=this.state.parr.length+1;i++){
            tempArr.push(i);
        }
        this.setState({
            parr:[...tempArr],
            currPage:this.state.currPage+1,
        }, this.changeMovies)
        console.log(this.state.currPage);
       
    }
    handlePrevious=()=>{
        let prevArr=[];
        for(let i=1;i<=this.state.parr.length-1;i++){
            prevArr.push(i);
        }
        if(this.state.currPage!=1){
            this.setState({
                parr:[...prevArr],
                currPage:this.state.currPage-1,  
            },this.changeMovies)
        }
   
        console.log(this.state.currPage);
    }
    handlepagenum=(pageNum)=>{
        this.setState({
            currPage:pageNum,
        },this.changeMovies)
    }
    handleFavourites=(movieobj)=>{
        let localstoragemovies=JSON.parse(localStorage.getItem("movies"))||[];
        if(this.state.fm.includes(movieobj.id)){ //includes is like boolean for arr specially
            localstoragemovies=localstoragemovies.filter(
                (movie)=>movie.id!=movieobj.id //if id is same we don't gonna push in arr
            );
        }
        else localstoragemovies.push(movieobj);
        console.log(localstoragemovies);
        localStorage.setItem("movies",JSON.stringify(localstoragemovies));
        let tempData=localstoragemovies.map(movieobj=>movieobj.id);
        this.setState({ //this is done coz if first check the location and spread operator forms at new place that'why it adds in an arr
            fm:[...tempData],
        });
    }
    async componentDidMount(){
        // console.log("componentdidmount is called");
        let res=await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=a70924997e02110adcecdf0c4fa26bff&language=en-US&page=${this.state.currPage}`);

        // console.log(res.data);
        this.setState({
          movies:[...res.data.results]//movies ke obj honge[{},{},{}]
        })
      }
  render() {
    // console.log("render is called");
    // let movie=movies.results;
    return (
        <>
        {
            this.state.movies.length==0?(
            <div class="spinner-grow text-danger" role="status">
                <span class="visually-hidden">Loading...</span>
                </div>
            ):(
                // this is a inbuilt function of bootstrap
                <div>
                    <h3 className='text-center'> 
                    <strong>Trending</strong>
                    </h3>
                    <div className='movies-list'>
                        {
                            this.state.movies.map((movieobj)=>(
                                <div className="movie-card" onMouseEnter={()=>this.handleEnter(movieobj.id)} onMouseleave={this.handleLeave}>
                                <img src={`https://image.tmdb.org/t/p/original${movieobj.backdrop_path}`} className="card-img-top banner-img" alt="..."
                                style={{height:"40vh"}}/>
                                {/* <div className="card-body"> */}
                                  <h5 className="card-title movie-title">{movieobj.original_title}</h5>
                                  {/* <p className="card-text movie-overview">{movieobj.overview}</p> */}
                                  <div className='button-wrapper'>
                                    {this.state.hover==movieobj.id &&(
                                                 <a  className="btn btn-danger movie-button" onClick={()=>this.handleFavourites(movieobj)}> {this.state.fm.includes(movieobj.id)?"Remove from favourites":"Add to Favourites"}</a>
                                    )}
                           
                                  </div>
                                </div>
                            ))

                        }
                    </div>
                    <div className='pagination'>
                    <nav aria-label="Page navigation example">
                        <ul class="pagination">
                            <li class="page-item"><a class="page-link"  onClick={this.handlePrevious}>Previous</a></li>
                            {//coz we are writing javascript that's why we apply curly braces
                                       this.state.parr.map (pageNum =>(
                                        <li class="page-item"><a class="page-link" onClick={()=>{this.handlepagenum(pageNum)}} >{pageNum}</a></li>
   
                               ))
                            }
                     
                       
                            <li class="page-item"><a class="page-link" onClick={this.handleNext}>Next</a></li>
                            </ul>
                    </nav>
                    </div>
              
                </div>

            )
        }
        </>
    )
  }
}
