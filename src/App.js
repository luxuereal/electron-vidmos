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
      console.log(this.state.playList);
    });
  }
  componentWillMount(){   
  }
  openFiles(e) {
    let data = e.target.getAttribute('data-type');
    setTimeout(() => {
      ipcRenderer.send('open-local', data);
      console.log(data);
    }, 300);
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
    let player = document.getElementById('thePlayer');
    let fluid = document.querySelector('.vol-fluid');
    player.muted = !this.state.isMute;
    this.setState({isMute: !this.state.isMute}); 
    if(!this.state.isMute){
      fluid.style.width = 0 + '%';
    }else{
      fluid.style.width = ((this.state.volume === 0) ? 67 : this.state.volume) + '%';
      if(this.state.volume === 0) this.setState({volume: 67});
    }
  }
  seek(event) {
    let player = document.getElementById('thePlayer');
    let xCord = Math.round(event.clientX / window.innerWidth * 100);
    player.currentTime = (player.duration / 100) * xCord;
    document.getElementById('seekbar').style.width = xCord + "%";
  }
  volume(event) {
    let player = document.getElementById('thePlayer');
    let element = document.querySelector('.vol-fluid');
    let rect = event.target.getBoundingClientRect();
    let vol = (event.clientX) - rect.left;
    if(vol > 100){
      vol = 100;
    }else if(vol <= 0){
      this.setState({isMute: !this.state.isMute});
      vol = 0;
    }
    element.style.width = vol + '%';
    this.setState({volume: vol});
    player.volume = vol / 100;
    if (this.state.isMute) this.setState({ isMute: !this.state.isMute });
  }
  stopVideo(){
    let player = document.getElementById('thePlayer');
    let source = document.querySelector('#thePlayer source');
    if (source != null) {
      player.pause();
      player.currentTime = 0;
    } else {
      alert("There is no video to stop.");
    }
  }
  prevVideo() {
  }
  nextVideo() {
  }
  playPauseVideo() {
    let player = document.getElementById('thePlayer');
    let source = document.querySelector('#thePlayer source');
    if(source != null){
      if(player.paused){
        player.play();
      }else{
        player.pause();
      }
      this.setState({isPlaying: !this.state.isPlaying});
    }else{
      alert("There is no video to play/pause.");
    }
  }
  toggleFullScreen() {
    let source = document.querySelector('#thePlayer source');
    if(source !== null){
      if(this.state.isFullScreen){
        document.webkitCancelFullScreen(); 
        document.querySelector('.player-wrapper').classList.remove('full');
      } else {
        document.querySelector('.player-wrapper').classList.add('full');
        document.getElementById('video-container').webkitRequestFullScreen();
      }
      this.setState({ isFullScreen: !this.state.isFullScreen });
      document.querySelector('.control-container').classList.remove('full');
    }else{
      alert('Cannot enter full screen when no video is loaded.');
    }
  }
  toggleControls(){
    let controls = document.querySelector('.control-container');
    let playerWrapper = document.querySelector('.player-wrapper');
    controls.classList.remove('full');
    if (this.state.isFullScreen && playerWrapper.classList.contains('full')) {
      setTimeout(() => {
        controls.classList.add('full');
      }, 5000);
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
          stopVideo={this.stopVideo.bind(this)}
          prevVideo={this.prevVideo.bind(this)}
          nextVideo={this.nextVideo.bind(this)}
          timeUpdate={this.timeUpdate.bind(this)}
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
