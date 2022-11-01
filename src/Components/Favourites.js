import React, { Component } from 'react';
import axios from "axios";
import {movies} from './getmovies'

export default class Favourites extends Component {
    constructor(){
        super();
        this.state={
            movies:[],
            genre:[],
            currGenre:"All Genre",
            currText:"",
            currPage:1,
            limit:5,
        }
    }

    async componentDidMount(){
        // console.log("componentdidmount is called");
        // let res=await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=a70924997e02110adcecdf0c4fa26bff&language=en-US&page=1`);
        let results=JSON.parse(localStorage.getItem("movies")); //localstorage se get kr rhe he data ko with the help of getitem
        let genreId = {
            28: "Action",
            12: "Adventure",
            16: "Animation",
            35: "Comedy",
            80: "Crime",
            99: "Documentary",
            18: "Drama",
            10751: "Family",
            14: "Fantasy",
            36: "History",
            27: "Horror",
            10402: "Music",
            9648: "Mystery",
            10749: "Romance",
            878: "Sci-Fi",
            10770: "TV",
            53: "Thriller",
            10752: "War",
            37: "Western",
          };
        // console.log(res.data);
        let genreArr=[];
        results.map((movieobj)=>{
            if(!genreArr.includes(genreId[movieobj.genre_ids[0]])){
                genreArr.push(genreId[movieobj.genre_ids[0]]);
            }
        })
        genreArr.unshift("All Genre");
        console.log(genreArr);
        this.setState({
          movies:[...results],//movies ke obj honge[{},{},{}]
          genre:[...genreArr]
        })
    }
      handlecurrgenre=(genre)=>{
        this.setState({
            currGenre:genre
        })
      }
      handleText=(e)=>{
        this.setState({
            currText:e.target.value
        });
      }
      sortpopularityascendingorder=()=>{
        let allMovies=this.state.movies;
        allMovies.sort((objA,objB)=>{
            return objA.popularity-objB.popularity;
        });
        this.setState({
            movies:[...allMovies],
        })
      }
      sortpopularitydescendingorder=()=>{
        let allMovies=this.state.movies;
        allMovies.sort((objA,objB)=>{
            return objB.popularity-objA.popularity;
        });
        this.setState({
            movies:[...allMovies],
        })
      }

      sortratingascendingorder=()=>{
        let allMovies=this.state.movies;
        allMovies.sort((objA,objB)=>{
            return objA.vote_average-objB.vote_average;
        });
        this.setState({
            movies:[...allMovies],
        })
      }

      sortratingdescendingorder=()=>{
        let allMovies=this.state.movies;
        allMovies.sort((objA,objB)=>{
            return objB.vote_average-objA.vote_average;
        });
        this.setState({
            movies:[...allMovies],
        })
      }
      handlePageNum=(page)=>{
        this.setState({
          currPage:page
        })
      }
      handleDelete=(id)=>{
       let newMovies= this.state.movies.filter((movieObj)=>{
            return movieObj.id!=id;
        })
        this.setState({
            movies:[...newMovies],
        })
        //localstorage me set krna padega
        localStorage.setItem("movies",JSON.stringify(newMovies));
      }
  render() {
    let genreId = {
        28: "Action",
        12: "Adventure",
        16: "Animation",
        35: "Comedy",
        80: "Crime",
        99: "Documentary",
        18: "Drama",
        10751: "Family",
        14: "Fantasy",
        36: "History",
        27: "Horror",
        10402: "Music",
        9648: "Mystery",
        10749: "Romance",
        878: "Sci-Fi",
        10770: "TV",
        53: "Thriller",
        10752: "War",
        37: "Western",
      };
      let filteredMovies=this.state.movies;
      if(this.state.currText===""){
        filteredMovies=this.state.movies;
      }
      else{
        filteredMovies=filteredMovies.filter((movieObj)=>{
            let movieName=movieObj.original_title.toLowerCase();
            return movieName.includes(this.state.currText);//[t,o,p,g,u,n]
        })
       }
      
      if(this.state.currGenre!="All Genre"){
        filteredMovies=filteredMovies.filter(
            (movieobj)=>genreId[movieobj.genre_ids[0]]==this.state.currGenre//ab jo filtered movies ke andar he vhi vali movies ayegi
        )
      }
      let numofpages=Math.ceil(filteredMovies.length/this.state.limit);//18/5
      let pagesArr=[];
      for(let i=1;i<=numofpages;i++){
        pagesArr.push(i);//[1,2,3,4]
      }
      let si=(this.state.currPage-1)*this.state.limit;
      let ei=si+this.state.limit-1;
      filteredMovies=filteredMovies.slice(si,ei+1);
    return (
        <div class="row" >
            <div class="col-3 Favourite-List">
            <ul class="list-group" >
                {this.state.genre.map((genre)=>(
                    this.state.currGenre==genre?
                    <li class="list-group-item active">{genre}</li>:
                    <li class="list-group-item " onClick={()=>this.handlecurrgenre(genre)}>{genre}</li>
                ))}
                
               
            </ul>
        </div>
        <div class="col Favourite-Table" >
            <div>
                <input type="text" className="col-3"placeholder='search' value={this.state.currText} onChange={this.handleText}></input>
                <input type="number" className="col-9"value={this.state.limit} onChange={(e)=>this.setState({limit:e.target.value})}></input>
            </div>
            <div class="row">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Genre</th>
                        <th scope="col"><i class="fa-solid fa-caret-up" onClick={this.sortpopularityascendingorder}/>Popularity<i class="fa-solid fa-caret-down" onClick={this.sortpopularitydescendingorder}/></th>
                        <th scope="col"><i class="fa-solid fa-caret-up" onClick={this.sortratingascendingorder}/>Rating<i class="fa-solid fa-caret-down" onClick={this.sortratingdescendingorder}/></th>
                        </tr>
                </thead>
                <tbody>
                    {filteredMovies.map((movieobj)=>(
                        <tr>
                            <td scope="row"><img src={`https://image.tmdb.org/t/p/original${movieobj.backdrop_path}`}style={{width:'8rem'}}/>{movieobj.original_title}</td>
                            <td>{genreId[movieobj.genre_ids[0]]}</td>
                            <td>{movieobj.popularity}</td>
                            <td>{movieobj.vote_average}</td>
                            <td><button className='btn btn-outline-danger'onClick={()=>this.handleDelete(movieobj.id)}>Delete</button></td>
                        </tr>
                    ))}
                   
                                </tbody>
            </table>
            </div>
            </div>
            <nav aria-label="Page navigation example">
  <ul class="pagination">
  {pagesArr.map((page)=>(
      <li class="page-item"><a class="page-link" onClick={()=>this.handlePageNum(page)}>{page}
      </a></li>
      ))}
  </ul>
</nav>
            </div>
    )
  }
}
