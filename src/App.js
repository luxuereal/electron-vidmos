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
      playIndex: 0,
      playList: [],
      isPlaying: false,
      isFullScreen: false,
      isDialogOpened: false,
    }
    ipcRenderer.on('is-maximized', (event, bool) => {
      this.setState({isMax: bool});
    }); 
    ipcRenderer.on('playables', (event, arr) => {
      if(arr.length === 0) return this.alert('Please select valid file or directory with supported media.');
      localStorage.setItem('playList', arr);
      this.setState({playList: arr});
      this.initPlayer();
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
  alert(data){   
    let alert = document.querySelector('.alert-wrapper .alert');
    alert.style.display = 'block';
    alert.innerHTML = data;
    setTimeout(() => {
      alert.style.display = 'none';
    }, 5000);
  }
  openFiles(e) {
    ipcRenderer.send('open-local', 'file');
  }
  openDirectory() {
    ipcRenderer.send('open-local', 'dir');
  }
  initPlayer() {
    let player = document.getElementById('thePlayer');
    let currSrc = document.querySelector('#thePlayer source');
    if(currSrc != null){
      currSrc.setAttribute('src', this.state.playList[0]);
    }else{
      let source = document.createElement('source');
      player.removeAttribute('src');
      source.setAttribute('src', this.state.playList[0]);
      player.appendChild(source);
    }
    player.load();
    player.play();
    player.volume = this.state.volume / 100;
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
    if(player.currentTime === player.duration){
      if(this.state.playIndex < this.state.playList.length - 1){
        this.nextVideo();
      }else{
        this.stopVideo();
      }
    }
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
      this.alert('Cannot seek when no video is being played.');
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
      this.setState({isPlaying: false});
    } else {
      this.alert("There is no video to stop.");
    }
  }
  prevVideo() {
    let player = document.getElementById('thePlayer');
    let source = document.querySelector('#thePlayer source');
    if(source != null){
      let src = source.getAttribute('src');
      let idx = this.state.playList.indexOf(src);
      if(idx > 0){
        this.stopVideo();
        player.removeAttribute('src');
        source.setAttribute('src', this.state.playList[idx - 1]);
        player.load();
        player.play();
        this.setState({ playIndex: idx - 1});
        this.setState({isPlaying: true});
      }
    } 
  }
  nextVideo() {
    let player = document.getElementById('thePlayer');
    let source = document.querySelector('#thePlayer source');
    if (source != null) {
      let src = source.getAttribute('src');
      let idx = this.state.playList.indexOf(src);
      if (idx < this.state.playList.length - 1) {
        this.stopVideo();
        player.removeAttribute('src');
        source.setAttribute('src', this.state.playList[idx + 1]);
        player.load();
        player.play();
        this.setState({ playIndex: idx + 1 });
        this.setState({ isPlaying: true });
      }
    }
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
      this.alert("There is no video to play/pause.");
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
      this.alert('Cannot enter full screen when no video is loaded.');
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
          openDirectory={this.openDirectory.bind(this)}
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
        <div className="alert-wrapper">
          <div className="alert"></div>
        </div>
      </div>
    );
  }
}

export default App;
