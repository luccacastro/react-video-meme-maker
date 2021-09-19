import VideoCaption from './VideoCaption'

const VideoPlaceholder = ({file, text, font}) => {
    return(
        <div className="video_player" >
            <VideoCaption text={text} font={font}/>
            <div className="video_media">
                <div key={file.name}>
                    <div>
                    { file.type != "image/gif"?
                        <video className="video_mp4" style={{width: "500px", height:"350px"}}src={file.preview} controls></video>:
                        <img className="video_mp4" src={file.preview} style={{width: "500px"}} />
                    }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoPlaceholder;