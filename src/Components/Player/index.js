import React, { Component } from 'react';
import './Player.css';

class Player extends Component{
    render() {
        let fullScreenToggler = <b id="enter"></b>;
        if(this.props.state.isFullScreen){
            fullScreenToggler = <b id="exit"></b>
        }else{
            fullScreenToggler = <b id="enter"></b>;
        }
        return(
            <div id="video-container">
                <video id="thePlayer" onDoubleClick={this.props.toggleFullScreen.bind(this)}>
                </video>
                <div className="control-container">
                    <div className="seekbar"
                        
                        onMouseDown={this.props.seek.bind(this)}
                    >
                        <div className="fluid" id="seekbar"></div>
                    </div>
                    <div className="controls">
                        <span title="Previous" onClick={this.props.prevVideo.bind(this)}>
                            <b data-id="prev"></b>
                        </span>
                        <span title="Play | Pause" onClick={this.props.playPauseVideo.bind(this)}>
                            <b data-id="play"></b>
                        </span>
                        <span title="Stop" onClick={this.props.playPauseVideo.bind(this)}>
                            <b data-id="stop"></b>
                        </span>
                        <span title="Next" onClick={this.props.nextVideo.bind(this)}>
                            <b data-id="next"></b>
                        </span>
                        <span className="speaker">
                          <b data-id="spkr-high" title="Mute | Unmute" onClick={this.props.toggleMute.bind(this)}></b>
                          <div className="vol-slider" onMouseDown={this.props.volume.bind(this)}>
                            <div className="vol-fluid"></div>
                          </div>
                        </span>
                        <span className="timer">0:00:00 / <span id="total">0:00:00</span></span>
                        <span className="full-screen" title="Toggle Full Screen" onClick={this.props.toggleFullScreen}>
                            {fullScreenToggler}
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

export default Player;