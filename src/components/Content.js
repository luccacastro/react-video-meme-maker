import {useDropzone} from 'react-dropzone'
import React, {useState, useEffect, useContext, createContext}  from 'react'
import UrlContainer from './UrlContainer'
import Dropzone from './Dropzone'
import VideoMenu from './VideoMenu'
import {useHistory} from 'react-router-dom' 

export const MediaContext = createContext()

const Content = () => {
    const [media, setMedia] = useState()
    const history = useHistory();
    // const [isLoading, setIsLoading] = useState(false)
    // const [media, setVideoStyle] = useState()
    useEffect(()=>{
        console.log(media)
        if(media){
            history.push({
                pathname: "/video-edit",
                state: {file: media}
            })
        }
    },[media])
    
    return(
        <div className="file_container">
            <MediaContext.Provider value={setMedia}>
                {/* {media.length ? <VideoMenu content={images} file={media[0]}/> :  <Dropzone/>}*/}
                <Dropzone/>
                <UrlContainer/>
            </MediaContext.Provider>
        </div>
    )
}

{/* <Redirect to={{
                    pathname: "/video-edit",
                        state: {
                            content: images,
                            file: media[0]
                        },
                    }
                }/> */}

export default Content