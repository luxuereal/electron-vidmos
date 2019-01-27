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
      seekProcess: 0,
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

    window.addEventListener('keyup', (e) => e.preventDefault());

    ipcRenderer.on('stopVideo', () => this.stopVideo());
    ipcRenderer.on('toggleMute', () => this.toggleMute());
    ipcRenderer.on('seekBack', () => this.seek(null, 'back'));
    ipcRenderer.on('seekNext', () => this.seek(null, 'next'));
    ipcRenderer.on('volumeUp', () => this.volume(null, 'up'));
    ipcRenderer.on('volumeDn', () => this.volume(null, 'down'));
    ipcRenderer.on('playPauseVideo', () => this.playPauseVideo());
    ipcRenderer.on('toggleFullScreen', () => this.toggleFullScreen(true));
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
    this.setState({ seekProcess: ((player.currentTime / player.duration) * 100)});
  }
  toggleMute() {
    let player = document.getElementById('thePlayer');
    let fluid = document.querySelector('.vol-fluid');
    if (player.muted && this.state.isMute) {
      player.muted = false;
      if (this.state.volume === 0) this.setState({ volume: 67 });
      player.volume = ((this.state.volume === 0) ? 67 : this.state.volume) / 100;
      fluid.style.width = ((this.state.volume === 0) ? 67 : this.state.volume) + '%';
    } else {
      player.muted = true;
      fluid.style.width = 0 + '%';
    }
    this.setState({isMute: !this.state.isMute});
  }
  seek(event, update = null) {
    let xCord = this.state.seekProcess;
    let player = document.getElementById('thePlayer');
    let source = document.querySelector('#thePlayer source');
    if(source !== null){
      if(update === null){
        xCord = Math.round(event.clientX / window.innerWidth * 100)
      }else if(update === 'next'){
        xCord += 2;
      }else{
        xCord -= 2;
      }
      if(xCord > 100){
        xCord = 100;
      }else if(xCord < 0){
        xCord = 0;
      }
      if(player.paused){
        player.play();
        this.setState({isPlaying: true});
      }
      player.currentTime = (player.duration / 100) * xCord;
      document.getElementById('seekbar').style.width = xCord + "%";
    }else{
      alert('Cannot seek when no video is being played.');
    }
  }
  volume(event, update = null) {
    let vol = this.state.volume;
    let player = document.getElementById('thePlayer');
    let element = document.querySelector('.vol-fluid');
    if(update === null){
      let rect = event.target.getBoundingClientRect();
      vol = (event.clientX) - rect.left;
    }else if(update === 'up'){
      vol = this.state.volume + 10;
    }else{
      vol = this.state.volume - 10;
    }
    if (vol > 100) {
      vol = 100;
      player.muted = false;
      this.setState({isMute: false});
    } else if (vol <= 0) {
      vol = 0;
      player.muted = true;
      this.setState({isMute: true});
    }else{
      player.muted = false;
      this.setState({ isMute: false });
    }
    player.volume = vol / 100;
    this.setState({ volume: vol });
    element.style.width = vol + '%';
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
      if(player.paused && !this.state.isPlaying){
        player.play();
      }else{
        player.pause();
      }
      this.setState({isPlaying: !this.state.isPlaying});
    }else{
      alert("There is no video to play/pause.");
    }
  }
  toggleFullScreen(isFromElectron=false) {
    let source = document.querySelector('#thePlayer source');
    if(source !== null){
      if(this.state.isFullScreen){
        document.webkitCancelFullScreen();
        this.setState({isFullScreen: false});
        document.querySelector('#theTitleBar').style.display = 'block';
        if(isFromElectron) ipcRenderer.send('enter-full-screen', false);
        document.querySelector('.player-wrapper').classList.remove('full');
        document.querySelector('.control-container').classList.remove('full');
      } else {
        this.setState({ isFullScreen: true });
        document.querySelector('#theTitleBar').style.display = 'none';
        if(isFromElectron) ipcRenderer.send('enter-full-screen', true);
        document.querySelector('.player-wrapper').classList.add('full');
        document.querySelector('.control-container').classList.add('full');
        document.getElementById('video-container').webkitRequestFullScreen();
      }
      setTimeout(() => document.querySelector('.control-container').classList.remove('full'), 500);
    }else{
      alert('Cannot enter full screen when no video is loaded.');
    }
  }
  toggleControls(){
    let controls = document.querySelector('.control-container');
    let playerWrapper = document.querySelector('.player-wrapper');
    controls.classList.remove('full');
    setTimeout(() => {
      if (this.state.isFullScreen && playerWrapper.classList.contains('full')) {
        controls.classList.add('full');
      }
    }, 3000);
    
  }
  closeApp() {
    ipcRenderer.send('exit');
  }
  maximizeApp() {
    this.setState({isMax: !this.state.isMax});
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
