

const VideoCaption = ({text, font}) =>{
    return(
        <div>
             {text? <div className="text_placeholder">
                    <p className="rec_text" style={{fontSize: `${Math.round(font)}px`}}>{text}</p>
                </div>: null}
        </div>
    )
}

export default VideoCaption