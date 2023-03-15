import "./App.css";
import Navigation from "./Components/Navigation/Navigation";
import Logo from "./Components/Logo/Logo";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import FacialRecognition from "./Components/FacialRecognition/FacialRecognition";
import Rank from "./Components/Rank/Rank";
import Signin from "./Components/Signin/Signin";
import Register from "./Components/Register/Register";
import ParticlesBg from "particles-bg";
import { Component } from "react";
import React from "react";

// APi Key: f5380ce36e47464bb523f2f3897b175e
// ImageUrl: https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGZhY2V8ZW58MHx8MHx8&w=1000&q=80



const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: 'signIn',
  isSignIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: new Date()
  }
}
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
    };
  

  loadUser = (data) => {
    this.setState ({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})

  }

  faceCalculation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = (inputBox) => {
    console.log(inputBox);
    this.setState({ box: inputBox });
  };
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch('http://localhost:3000/imagepredict', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              image: this.state.input
            })})
            .then(response => response.json())
            .then((response) => this.displayFaceBox(this.faceCalculation(response)))
            .catch((err) => console.log(err));
            fetch('http://localhost:3000/image', {
                  method: 'put',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({
                    id: this.state.user.id
                  })
                })
              .then(response => response.json())
              .then(coun => Object.assign(this.state.user, {entries: coun}))
          
  };

  onRouteChange = (route) => {
    if(route === 'home'){
      this.setState({isSignIn: true});
    }else {
      this.setState(initialState);
    }
    this.setState({route: route});
    console.log({route});
  }

  render() {
    const { isSignIn, route, box, imageUrl} = this.state;
    return (
      <div className="App">
        {console.log(this.state.route)}
        <Navigation  onRouteChange = {this.onRouteChange} isSignIn = {isSignIn}/>
        {/* {route === 'signIn' ?
          <Signin onRouteChange = {this.onRouteChange}/> 
          : route === 'register' ?
            <Register onRouteChange = {this.onRouteChange}/> 
          :
            <div>
              <Logo />
              <Rank />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
            </div>
      } */}
      {route === 'home' ?
          <div>
            {console.log(this.state.route)}
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
          </div> 
          : (
            route === 'signIn' ?
          <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/> 
          : <Register loadUser={this.loadUser} onRouteChange = {this.onRouteChange}/> )
            
    }
        <ParticlesBg
          type="circle"
          num={5}
          bg={{
            position: "fixed",
            zIndex: -1,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        />
        <FacialRecognition
          box={box}
          inputImage={imageUrl}
        />
      </div>
    );
  }
}


export default App;
