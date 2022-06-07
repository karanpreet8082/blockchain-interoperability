import React from 'react';
import create from './res/create.jpg'
import refund from './res/refund.png'
import details from './res/details.png'
import withdraw from './res/withdraw.jpg'
import respond from './res/respond.jpg'

import './SLideshow.css';
class Slideshow extends React.Component {
	constructor(props) {
        super(props);
		this.plusSlides = this.plusSlides.bind(this);
		this.showSlides= this.showSlides.bind(this);
		this.state = {
			slideIndex: 1
		};
	}
	
	plusSlides(n) {
        console.log("hello");
		this.showSlides(this.state.slideIndex += n);
	}

	showSlides(n) {
		var i;
        var slides = document.getElementsByClassName("mySlides");
        if (n > slides.length) {this.state.slideIndex = 1}    
        if (n < 1) {this.state.slideIndex = slides.length}
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
        }
        slides[this.state.slideIndex-1].style.display = "block";  
	}


	
	componentDidUpdate() {
		this.showSlides(this.state.slideIndex);
	}
	
	componentDidMount() {
		this.showSlides(this.state.slideIndex);
	}
	
	render() {
		return(    
            <div class="jumbotron" style={{height:"400px"}}>    
            <div class="slideshow-container">

            <div class="mySlides">
             <div class='container2' >
                    <div>
                        <img src={respond} style={{width: "10%", height: "auto", borderRadius: "50%"}} alt=""  />
                    </div>	
                <div style={{marginLeft:"100px"}}>
                <p> is the person who is responsible for thrttlinh the server netows free trenf grtetiyng sc vfd frytguwd  odpechndc deodndkcwp jifoepdc sc eofncslxaowdc owdncdoede ceodwwwwfjrufn  riws wqe ie dwpweqns </p>
                
                </div>
            </div>
            </div>
            
            <div class="mySlides">
              <q>But man is not made for defeat. A man can be destroyed but not defeated.</q>
              <p class="author">- Ernest Hemingway</p>
            </div>
            
            <div class="mySlides">
              <q>I have not failed. I've just found 10,000 ways that won't work.</q>
              <p class="author">- Thomas A. Edison</p>
            </div>
            
            <a class="prev" onClick={()=> {this.plusSlides(-1)}}><i class='fa fa-fw fa-chevron-left' ></i></a>
            <a class="next" onClick={()=> {this.plusSlides(-1)}}><i class='fa fa-fw fa-chevron-right' ></i></a>
            
            </div>
            
            </div>


		);
	}
}

export default Slideshow;