import {useState, useEffect, useContext} from 'react'
import {createUseStyles} from 'react-jss'
import TwitterIcon from '../icons/twitter.png'
import YoutubeIcon from '../icons/youtube.png'
import RedditIcon from '../icons/reddit.png'
import InstagramIcon from '../icons/instagram.png'
import { MediaContext } from './Content'
import axios from 'axios';

const UrlContainer = () =>{
    const [style, setStyle] = useState()
    const [btnStyle, setBtnStyle] = useState()
    const [currentStyle, setCurrentStyle] = useState()
    const [currentURL, setCurrentURL] = useState()
    const [btnStatus, setBtnStatus] = useState({reddit:  true, instagram: false, youtube: false, twitter: false, url: false})
    const setMedia = useContext(MediaContext)
    // const urlStyles = useStyles()
    let main_styles = {
        // reddit_clr: "#CC4400",
        // youtube_clr: "#F50000",
        // twitter_clr: "#0B7BC1",
        // reddit_clr: "#692C8C",
        reddit_style : {
            backgroundColor: "#FF5700",
            border:"2px dashed #CC4400",
            boxShadow:"0 0 0 15px #FF691F",
        },
        youtube_style : {
            backgroundColor: "#FF1F1F",
            border:"2px dashed #F50000",
            boxShadow:"0 0 0 15px #FF3333",
        },
        twitter_style : {
            backgroundColor: "#1DA1F2",
            border:"2px dashed #0B7BC1",
            boxShadow:"0 0 0 15px #3EAEF4",
        },
        instagram_style:{
            backgroundColor: "#8a3ab9",
            border:"2px dashed #692C8C",
            boxShadow:"0 0 0 15px #9E54C9",
        }
    }
    useEffect(()=>{
        setStyle(main_styles.instagram_style)
        setBtnStyle({backgroundColor: main_styles.instagram_style.boxShadow.split(" ")[4]})
    },[])

    const IconState = (url) =>  {
        setStyle(main_styles[url])
        setBtnStyle({backgroundColor: main_styles[url].boxShadow.split(" ")[4]})
        let styleName =  url.split("_")[0]
        let btnStatusDict = btnStatus
        Object.keys(btnStatusDict).forEach(v => btnStatusDict[v] = false)
        // btnStatusDict = 
        setBtnStatus({...btnStatusDict, [styleName]: true})
        setCurrentStyle(styleName)
        console.log(btnStatus)
        // setBtnStatus({...btnStatus, [styleName]: true })
        
        // setBtnStatus({...btnStatus, styleName: true})
        
    }

    const URLText = (e) => {
        setCurrentURL(e.target.value)
    }

    const sendURL = async () => {
        // console.log(Object.keys(main_style))
        // let route = style.split("_")[0]
        const url = `http://localhost:8000/${currentStyle}-url/request?url=${currentURL}`
        
        let res = await urlRequest(url)
        console.log(res)
        let data = await getFile(res.preview)
        setMedia(data)      
    }

    const urlRequest = async (url) => {
        return await axios.post(url)
                .then(res =>res.data)
                // .then(res => res.preview})
    }

    const getFile = async (url) => {
        let response = await fetch(url)
        let data = await response.blob();
        let videoFile = new File([data], "file.mp4", {type: "video/mp4"})
        Object.assign(videoFile, {
            preview: URL.createObjectURL(videoFile)
        })
        return videoFile
    }

    return(
        <div>
            <div className="icon_wrapper">
                <img src={TwitterIcon} onClick={() => IconState("twitter_style")} width="60px"/>
                <img src={RedditIcon} onClick={() => IconState("reddit_style")} width="60px"/>
                <img src={YoutubeIcon} onClick={() => IconState("youtube_style")} width="60px"/>
                <img src={InstagramIcon} onClick={() => IconState("instagram_style")} width="60px"/> 
            </div>
            <div className="drop_container second" style={{height:"190px"}}>
                
                <div className="url_container" style={style}>
                    <div className="input_container">
                        <h4>Insert your link here!</h4>
                        <input onChange={URLText}/>
                        <button style={btnStyle} onClick={sendURL}>SEND</button>
                    </div>
                  
                </div>
            </div>
        </div>
    )
}

export default UrlContainer