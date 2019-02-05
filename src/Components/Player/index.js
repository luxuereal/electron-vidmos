import React, { Component } from 'react';
import './Player.css';

class Player extends Component{
    render() {
        let disabledPlay = "";
        let disabledPrev = "";
        let disabledNext = "";
        let idx = this.props.state.playIndex;
        if (this.props.state.playList.length > 0) {
            disabledPlay = "";
        } else {
            disabledPlay = "disabled";
        }
        if (idx < this.props.state.playList.length - 1) {
            disabledNext = "";
        } else {
            disabledNext = "disabled";
        }
        if (idx > 0) {
            disabledPrev = "";
        } else {
            disabledPrev = "disabled";
        }
        let volume = "spkr-high";
        let playOrPause = <b data-id="play"></b>;
        let fullScreenToggler = <b id="enter"></b>;
        if(this.props.state.isFullScreen){
            fullScreenToggler = <b id="exit"></b>
        }else{
            fullScreenToggler = <b id="enter"></b>;
        }
        if(this.props.state.isPlaying){
            playOrPause = <b data-id="pause"></b>;
        }else{
            playOrPause = <b data-id="play"></b>;
        }
        if(this.props.state.volume === 0 || this.props.state.isMute){
            volume = "spkr-mute";
        }else if(this.props.state.volume > 50){
            volume = "spkr-high";
        }else{
            volume = "spkr-min";
        }
        return(
            <div id="video-container">
                <div className="player-wrapper"
                    onDoubleClick={this.props.toggleFullScreen.bind(this)}
                >
                    <video id="thePlayer"
                        onTimeUpdate={this.props.timeUpdate.bind(this)}
                        onMouseMove={this.props.toggleControls.bind(this)}
                    >
                    </video>
                </div>
                <div className="control-container">
                    <div className="seekbar"
                        
                        onMouseDown={this.props.seek.bind(this)}
                    >
                        <div className="fluid" id="seekbar"></div>
                    </div>
                    <div className="controls">
                        <span title="Previous" className={disabledPrev} onClick={this.props.prevVideo.bind(this)}>
                            <b data-id="prev"></b>
                        </span>
                        <span title="Play | Pause" className={disabledPlay} onClick={this.props.playPauseVideo.bind(this)}>
                            {playOrPause}
                        </span>
                        <span title="Stop" className={disabledPlay} onClick={this.props.stopVideo.bind(this)}>
                            <b data-id="stop"></b>
                        </span>
                        <span title="Next" className={disabledNext} onClick={this.props.nextVideo.bind(this)}>
                            <b data-id="next"></b>
                        </span>
                        <span className="speaker">
                          <b data-id={volume} title="Mute | Unmute" onClick={this.props.toggleMute.bind(this)}></b>
                          <div className="vol-slider" onMouseDown={this.props.volume.bind(this)}>
                            <div className="vol-fluid"></div>
                          </div>
                        </span>
                        <span className="timer">0:00:00 / 0:00:00</span>
                        <span className={`full-screen ${disabledPlay}`} title="Toggle Full Screen" onClick={this.props.toggleFullScreen}>
                            {fullScreenToggler}
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

export default Player;