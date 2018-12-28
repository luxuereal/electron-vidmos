import React, { Component } from 'react';
import './Titlebar.css';

class Titlebar extends Component {
  render() {
      let max, rightControls,
            leftControls =  <div className="leftBtns">
                                <span>
                                    <b id="file"></b>
                                </span>
                                <span>
                                    <b id="folder"></b>
                                </span>
                                <i></i>
                                <span onClick={this.props.prevVideo.bind(this)}>
                                    <b id="prev"></b>
                                </span>
                                <span onClick={this.props.playPauseVideo.bind(this)}>
                                    <b id="play"></b>
                                </span>
                                <span onClick={this.props.nextVideo.bind(this)}>
                                    <b id="next"></b>
                                </span>
                                <i></i>
                                <span onClick={this.props.nextVideo.bind(this)}>
                                    <b id="spkr-high"></b>
                                </span>
                            </div>;
      if(this.props.isMax){
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
      <div className="Titlebar" onDoubleClick={this.props.maximizeApp.bind(this)}>
        <b className="title">{this.props.title}</b>
        {leftControls}
        {rightControls}
      </div>
    );
  }
}

export default Titlebar;
