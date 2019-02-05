import React, { Component } from 'react';
import './Titlebar.css';

class Titlebar extends Component {
  render() {
    let disabledPlay = "";
    let disabledPrev = "";
    let disabledNext = "";
    let idx = this.props.state.playIndex;
    if(this.props.state.playList.length > 0){
      disabledPlay = "";
    }else{
      disabledPlay = "disabled";
    }
    if (idx < this.props.state.playList.length - 1){
      disabledNext = "";
    }else{
      disabledNext = "disabled";
    }
    if (idx > 0) {
      disabledPrev = "";
    } else {
      disabledPrev = "disabled";
    }
    let playOrPause = <b id="play"></b>;
    if (this.props.state.isPlaying) {
      playOrPause = <b id="pause"></b>;
    } else {
      playOrPause = <b id="play"></b>;
    }
    let max, rightControls,
      leftControls =  <div className="leftBtns">
                        <span className="app">
                          <b id="app"></b>
                        </span>
                        <i></i>
                        <span title="Open File(s)" onClick={this.props.openFiles.bind(this)}>
                          <b id="file"></b>
                        </span>
                        <span title="Open Directory" onClick={this.props.openDirectory.bind(this)}>
                          <b id="folder"></b>
                        </span>
                        <i></i>
                        <span title="Previous" className={disabledPrev} onClick={this.props.prevVideo.bind(this)}>
                          <b id="prev"></b>
                        </span>
                        <span title="Play | Pause" className={disabledPlay} onClick={this.props.playPauseVideo.bind(this)}>
                          {playOrPause}
                        </span>
                        <span title="Next" className={disabledNext} onClick={this.props.nextVideo.bind(this)}>
                          <b id="next"></b>
                        </span>
                        {/* <i></i>
                        <span title="Playlist">
                          <b id="list"></b>
                        </span>
                        <span title="Recently Played">
                          <b id="recent"></b>
                        </span> */}
                      </div>;
    if(this.props.state.isMax){
      max = <b id="restore"></b>
    }else{
      max = <b id="rectangle"></b>
    }
    if(process.platform !== 'darwin'){
      rightControls = <div className="buttons">
                        <span onClick={this.props.minimizeApp.bind(this)}><b id="minimize"></b></span>
                        <span onClick={this.props.maximizeApp.bind(this)}>{max}</span>
                        <span className="close" onClick={this.props.closeApp.bind(this)}><b id="close"></b></span>
                      </div>;
    }else{
      rightControls = leftControls;
    }
    return (
      <div className="Titlebar" id="theTitleBar">
        <b className="title">{this.props.state.title}</b>
        {leftControls}
        {rightControls}
      </div>
    );
  }
}

export default Titlebar;
