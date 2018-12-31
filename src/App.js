import React, { Component } from 'react';
import Titlebar from './Components/Titlebar';
import Player from './Components/Player';
import './App.css';

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

class App extends Component {
  constructor() {
    super();
    this.state = {
      title: "Vidmos",
      isMax: false,
      volume: 67,
      isMute: false,
      playList: [],
      isPlaying: false,
      isFullScreen: false,
    }
    ipcRenderer.on('is-maximized', (event, bool) => {
      this.setState({isMax: bool});
    }); 
  }
  componentWillMount(){   
  }
  openFiles() {
    ipcRenderer.send('open-file');
  }
  toggleMute() {
     
  }
  seek(event) {
    let xCord = Math.round(event.clientX / window.innerWidth * 100);
    document.getElementById('seekbar').style.width = xCord + "%";
  }
  volume(event) {
    let rect = event.target.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let elements = document.querySelectorAll('.vol-fluid');
    elements.forEach(element => {
      element.style.width = x + '%';
    })
  }
  prevVideo() {
  }
  nextVideo() {
  }
  playPauseVideo() {
    this.setState({isPlaying: !this.state.isPlaying});
  }
  toggleFullScreen(event) {
    let el = document.getElementById('video-container');
    if(this.state.isFullScreen){
      document.webkitCancelFullScreen(); 
      el.classList.remove("full-screen-toggle");
      this.setState({isFullScreen: false});
    }else{
      el.classList.add("full-screen-toggle");
      el.webkitRequestFullScreen();
      this.setState({isFullScreen: true});
    }
    event.preventDefault();
  }
  closeApp() {
    ipcRenderer.send('exit');
  }
  maximizeApp() {
    ipcRenderer.send('maximize');
  }
  minimizeApp() {
    ipcRenderer.send('minimize');
  }
  render() {
    return (
      <div className="App">
        <Titlebar 
          state={this.state}
          closeApp={this.closeApp.bind(this)}
          openFiles={this.openFiles.bind(this)}
          prevVideo={this.prevVideo.bind(this)}
          nextVideo={this.nextVideo.bind(this)}
          maximizeApp={this.maximizeApp.bind(this)}
          minimizeApp={this.minimizeApp.bind(this)}
          playPauseVideo={this.playPauseVideo.bind(this)}
        />
        <Player
          state={this.state}          
          seek={this.seek.bind(this)}
          volume={this.volume.bind(this)}
          prevVideo={this.prevVideo.bind(this)}
          nextVideo={this.nextVideo.bind(this)}
          toggleMute={this.toggleMute.bind(this)}
          playPauseVideo={this.playPauseVideo.bind(this)}
          toggleFullScreen={this.toggleFullScreen.bind(this)}
        />
      </div>
    );
  }
}

export default App;
