

const VideoPlaceholder = (video, text, style) => {
    return(
        <div className="video_player"  style={style}>
               
        {text? <div className="text_placeholder">
                    <p className="rec_text">{text}</p>
                </div>: null}
            <div className="video_media">
                {video}
            </div>
        </div>
    )
}

export default VideoPlaceholder;