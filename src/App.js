import React, { Component } from 'react';
import './App.css';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';


const Clarifai = require('clarifai');
const app = new Clarifai.App({
  apiKey: '648d00e8568b4fc2a355c0890d9c92e5'
});


const particlesOptions = {
  'particles': {
    'number': {
      'value': 100,
    },
    'size': {
      "value": 3
  }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: ' ',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)

    }
  }
  displayFaceBox = (box) => {
    this.setState({ box: box });
  }
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }
  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response =>
        this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err))
  }
  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState({isSignedIn: false})
    }else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({ route: route })
  }

  render() {
    const {isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions} />
        <Navigation isSignedIn = {isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'home'
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition box={box}  imageUrl={imageUrl} />
          </div>
          :(
            (route === 'signin' || route === 'signout') ?
            <SignIn onRouteChange={this.onRouteChange} />
            :<Register onRouteChange={this.onRouteChange} />

          
          )       
        }
      
      </div>
    );
  }
}

export default App;
