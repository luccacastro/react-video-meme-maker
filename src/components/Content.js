import {useDropzone} from 'react-dropzone'
import React, {useState, useEffect}  from 'react'
import Dropzone from './Dropzone'
import VideoMenu from './VideoMenu'


const Content = () => {
    const [files, setFiles] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [videoStyle, setVideoStyle] = useState()

    
    
    const images = files.map((file) => (
        <div key={file.name}>
            <div>
                {/* <img src={file.preview} style={{width: "200px"}} alt="preview"/> */}
               { file.type != "image/gif"?
                <video className="video_mp4" style={{width: "500px"}}src={file.preview} controls>
                
                    {/* <source s type="video/mp4"/> */}
                </video>:
                <img className="video_mp4" src={file.preview} style={{width: "500px"}} />
                }
            </div>
        </div>
    ))
    
    return(
        <div className="file_container">

            {console.log(files)}
            
            {isLoading? <VideoMenu content={images} file={files[0]}/> :<Dropzone setFiles={setFiles} setIsLoading={setIsLoading}/>}

            
        </div>
    )
}

export default Content