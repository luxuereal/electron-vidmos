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
    ipcRenderer.on('playables', (event, arr) => {
      this.setState({playList: arr});
      this.initPlayer();
    });
  }
  componentWillMount(){   
  }
  openFiles(e) {
    ipcRenderer.send('open-local', e.target.getAttribute('data-type'));
  }
  initPlayer() {
    let player = document.getElementById('thePlayer');
    let source = document.createElement('source');
    source.setAttribute('src', this.state.playList[0]);
    player.appendChild(source);
    setTimeout(() => {
      player.play();
      this.setState({isPlaying: true});
      player.volume = this.state.volume / 100;
    }, 300); 
  }
  timeUpdate(){
    let player = document.getElementById('thePlayer');
    let timer = document.querySelector('.timer');
    let Chrs = (parseInt(player.currentTime / 3600, 10) < 10 ? '0' : '') + parseInt(player.currentTime / 3600, 10);
    let Cmins = (parseInt((player.currentTime % 3600) / 60) < 10 ? '0' : '') + parseInt((player.currentTime % 3600) / 60);
    let Csecs = (parseInt(player.currentTime % 60, 10) < 10 ? '0' : '') + parseInt(player.currentTime % 60, 10);
    let Thrs = (parseInt((player.duration / 3600), 10) < 10 ? '0' : '') + parseInt(((player.duration) / 3600), 10);
    let Tmins = (parseInt((player.duration % 3600) / 60) < 10 ? '0' : '') + parseInt((player.duration % 3600) / 60);
    let Tsecs = (parseInt(player.duration % 60, 10) < 10 ? '0' : '') + parseInt(player.duration % 60, 10);
    timer.innerHTML = `${Chrs}:${Cmins}:${Csecs} / ${Thrs}:${Tmins}:${Tsecs}`;
    document.getElementById('seekbar').style.width = ((player.currentTime / player.duration) * 100) + '%';
  }
  toggleMute() {
     
  }
  seek(event) {
    let player = document.getElementById('thePlayer');
    let xCord = Math.round(event.clientX / window.innerWidth * 100);
    player.currentTime = (player.duration / 100) * xCord;
    document.getElementById('seekbar').style.width = xCord + "%";
  }
  volume(event) {
    let player = document.getElementById('thePlayer');
    let rect = event.target.getBoundingClientRect();
    let vol = event.clientX - rect.left - 6;
    console.log(vol);
    let element = document.querySelector('.vol-fluid');
    element.style.width = vol + '%';
    this.setState({volume: vol});
    player.volume = vol / 100;
  }
  prevVideo() {
  }
  nextVideo() {
  }
  playPauseVideo() {
    let player = document.getElementById('thePlayer');
    if(player.paused){
      player.play();
    }else{
      player.pause();
    }
    this.setState({isPlaying: !this.state.isPlaying});
  }
  toggleFullScreen() {
    let source = document.querySelector('#thePlayer source');
    if(source !== null){
      if(this.state.isFullScreen){
        document.webkitCancelFullScreen(); 
        document.querySelector('.player-wrapper').classList.remove('full');
        document.querySelector('.control-container').classList.remove('full');
      } else {
        document.querySelector('.player-wrapper').classList.add('full');
        document.getElementById('video-container').webkitRequestFullScreen();
        document.querySelector('.control-container').classList.add('full');
      }
      this.setState({ isFullScreen: !this.state.isFullScreen });
    }
  }
  toggleControls(){
    let controls = document.querySelector('.control-container');
    if (this.state.isFullScreen) {
      controls.classList.remove('full');
      setTimeout(() => {
        controls.classList.add('full');
      }, 2000);
    }
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
          timeUpdate={this.timeUpdate.bind(this)}
          nextVideo={this.nextVideo.bind(this)}
          toggleMute={this.toggleMute.bind(this)}
          playPauseVideo={this.playPauseVideo.bind(this)}
          toggleControls={this.toggleControls.bind(this)}
          toggleFullScreen={this.toggleFullScreen.bind(this)}
        />
      </div>
    );
  }
}

export default App;
