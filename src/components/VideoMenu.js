import {useState, useEffect, useContext} from 'react'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
// import { editly} from 'editly'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { fadeOutDown } from 'react-animations'
import { saveAs } from 'file-saver';
import {ARIAL_TTF} from '../utils/arial.ttf'
import {FUTURA_TTF} from '../utils/futura.ttf'
import {readFromBlobOrFile, runFFmpeg, b64ToUint8Array} from '../utils/utils'
import VideoPlaceholder from './VideoPlaceholder'
// import {youtubedl} from 'youtube-dl-exec'

// const TextContext = React.createContext('text')

const VideoMenu = ({content, file}) =>{
    console.log(file)

    const ffmpeg = createFFmpeg({log: true});
    const [text, setText] = useState("")
    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)
    const [videoDimension, setVideoDimension] = useState({height: 0,width:0})
    const [percentage, setPercentage] = useState(0)
    const [fadeAnimation, setFadeAnimation] = useState()
    console.log(fadeAnimation, "fadeAnimation")
    // if(fadeAnimation){
    //     console.log(Object.keys(fadeAnimation),"hellooooooo")
    // }
    ffmpeg.setProgress(({ ratio }) => {
        console.log(ratio*100)
        setPercentage(ratio*100)
    });
    // const []
    // const [sentences, setSentences] = useState([])
    let sentences = []

    useEffect(() => {
        let video_res_obj = {}
        let text_placeholder = document.querySelector(".text_placeholder")
        let video_data = document.querySelector(".video_mp4")

        if(video_data.tagName == "VIDEO"){
            video_res_obj = {height:video_data.videoHeight, width: video_data.videoWidth }
            setVideoDimension(video_res_obj)
        }else{
            video_res_obj = {height:video_data.naturalWidth, width: video_data.naturalHeight }
            setVideoDimension(video_res_obj)
        }

        if(text_placeholder) {
            setHeight(text_placeholder.clientHeight)
            setWidth(text_placeholder.clientWidth)
        }
        console.log(height, "height dont")
    }, [text])

    const typeText = (e) => setText(e.target.value)

    const groupWordsToSentence = (text_lst, font) => {
        let words = []
        let amount = getTextWidth(text_lst, font)
        console.log(amount)
        if( amount < videoDimension.width*1.4) return [text_lst.join(" ")]
       
        for (let i = 0; i < text_lst.length; i++) {
            console.log(text_lst)
            console.log(words)
            words.push(text_lst[i]);
            console.log(font)
            let size = getTextWidth(words.join(" "), font)
            console.log(size)
            // let size_num = parseInt(size.replace("px", ""))
            if(size > videoDimension.width*1.4 || i == text_lst.length-1){
                sentences.push(words.join(" ")) 
                console.log(sentences)
                words = []
            }
        }
        return sentences
    }

    function getTextWidth(text, font) {
        var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    };
    

    const doTranscode = async () => {
        setFadeAnimation({animation: "fadeOut 0.8s forwards"})
        // {transition: 'all 0.6s', opacity: 0, marginTop: "50px", display:"none"}
        const text_p = document.querySelector('.rec_text')
        let text_lst = text_p.innerText.split(" ")
        // let font = window.getComputedStyle(text_p).font
        let font = `${videoDimension.height/11}pt arial`
        const text_length =(getTextWidth(text_p.innerText, window.getComputedStyle(text_p).font));
        let sentences = groupWordsToSentence(text_lst, font)
        let drawtext_cmd = []
        
        sentences.forEach((elem, idx) => {
            let cmd = `drawtext=text='${elem}':fontfile=futura.ttf:fontcolor=black:fontsize=${videoDimension.height/11}:x=(w-text_w)/2:y=-${videoDimension.height/11}+${(idx+1)*((videoDimension.height/11)+6)}`
            // conWsole.log("hello")
            drawtext_cmd.push(cmd)
        })
        
        if(!ffmpeg.isLoaded()) await ffmpeg.load();
       
        ffmpeg.FS('writeFile', file.name, await fetchFile(file.preview));
        // let text = new Blob(["00:00:00,000 --> 00:00:10,000\nHello there good afternoon people"])
        console.log("gffff", text)
        let font_uint8 = b64ToUint8Array(FUTURA_TTF)
        ffmpeg.FS('writeFile', 'futura.ttf', font_uint8)
        await ffmpeg.run('-i', file.name,'-vf',`pad=w=iw:h=${(drawtext_cmd.length*((videoDimension.height/11)+6))}+ih:y=${(drawtext_cmd.length*((videoDimension.height/11)+6))}:color=white,${drawtext_cmd}`,'-vcodec','libx264','output.mp4')

        // await ffmpeg.run('-i', file.name,'-vf',`pad=w=iw:h=${(height)*(0.4+(drawtext_cmd.length*0.15))}+ih:y=${(height*(0.4+(drawtext_cmd.length*0.15)))}:color=white,${drawtext_cmd}`,'-vcodec','libx264','output.mp4')
        const data = ffmpeg.FS('readFile', 'output.mp4')
        
        console.log(sentences)
        console.log(drawtext_cmd)
        console.log(text_length)
        console.log(videoDimension, "heloooooooooooooooooo")
        saveAs(URL.createObjectURL(new Blob([data.buffer], {type: "video/mp4"})))
      };

    return(
        
        <div>
        <div className="video_edit_container">
            {/* <VideoPlaceholder video={content} text={text} style={fadeAnimation}/> */}
           <div className="video_player"  style={fadeAnimation}>
                {text? <div className="text_placeholder">
                        <p className="rec_text">{text}</p>
                    </div>: null}
                <div className="video_media">
                    {content}
                </div>
            </div>
            <div className="video_edit_options"  style={fadeAnimation}>
                <h3>TEXT GOES HERE:</h3>
                <textarea className="glowing-border" rows="4" cols="28" onChange={typeText}></textarea>
                <select name="cars" id="cars">
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                </select>
                <button className="download_btn" onClick={doTranscode}> DOWNLOAD VIDEO</button>
            </div>
            <div style={{height: 100, width: 100, display: fadeAnimation? 'block':'none'}}>
                <CircularProgressbar value={percentage} text={`${Math.round(percentage)}%`}/>
            </div>
           
        </div>
       
        </div>
    )
}

export default VideoMenu