import React, { Component } from 'react';
import './Titlebar.css';

class Titlebar extends Component {
  render() {
    let max, rightControls,
      leftControls =  <div className="leftBtns">
                        <span title="Open File(s)" onClick={this.props.openFiles.bind(this)}>
                          <b id="file"></b>
                        </span>
                        <span title="Open Directory">
                          <b id="folder"></b>
                        </span>
                        <i></i>
                        <span title="Previous" onClick={this.props.prevVideo.bind(this)}>
                          <b id="prev"></b>
                        </span>
                        <span title="Play | Pause" onClick={this.props.playPauseVideo.bind(this)}>
                          <b id="play"></b>
                        </span>
                        <span title="Next" onClick={this.props.nextVideo.bind(this)}>
                          <b id="next"></b>
                        </span>
                        <i></i>
                        <span title="Playlist">
                          <b id="list"></b>
                        </span>
                        <span title="Recently Played">
                          <b id="recent"></b>
                        </span>
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
      <div className="Titlebar">
        <b className="title">{this.props.state.title}</b>
        {leftControls}
        {rightControls}
      </div>
    );
  }
}

export default Titlebar;
