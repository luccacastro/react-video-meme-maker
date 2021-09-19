import {useState, useEffect, useContext} from 'react'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
// import { editly} from 'editly'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { fadeOutDown } from 'react-animations'
import { saveAs } from 'file-saver';
import {ARIAL_TTF} from '../utils/arial.ttf'
import {FUTURA_TTF} from '../utils/futura.ttf'
import {useLocation} from 'react-router-dom' 
import {readFromBlobOrFile, runFFmpeg, b64ToUint8Array} from '../utils/utils'
import VideoPlaceholder from './VideoPlaceholder'
// import {youtubedl} from 'youtube-dl-exec'

// const TextContext = React.createContext('text')

const VideoMenu = (props) =>{
    const location = useLocation();

    let ffmpeg = createFFmpeg({log: true});
    const [text, setText] = useState("")
    const [height, setHeight] = useState(0)
    const [fontSize, setFontSize] = useState()
    const [width, setWidth] = useState(0)
    const [videoDimension, setVideoDimension] = useState({height: 0,width:0})
    const [percentage, setPercentage] = useState(0)
    const [fadeAnimation, setFadeAnimation] = useState()
    const [frames, setFrames] = useState([])
    const [file, setFile] = useState([])
    console.log(fadeAnimation, "fadeAnimation")
    // if(fadeAnimation){
    //     console.log(Object.keys(fadeAnimation),"hellooooooo")
    // }
    ffmpeg.setProgress(({ ratio }) => {
        // console.log(ratio*100)
        setPercentage(ratio*100)
    });

    const loadFFMPEG = async () => {await ffmpeg.load()}
    // const []
    // const [sentences, setSentences] = useState([])
    let sentences = []

    useEffect(async()=>{
        let a = location.state.file
        setFile(a)
        console.log(frames)
        const list = await generateImages(location.state.file, 0.5)
        console.log(list)
        setFrames(list)
        console.log(frames, "heloloooooooooooo")
    },[])

    useEffect(() => {
        // let a = location.state.file
        // setFile({a})

        console.log(location.state.file)
        // get images from video
        
        console.log(frames)
        let video_res_obj = {}
        let text_placeholder = document.querySelector(".text_placeholder")
        let video_data = document.querySelector(".video_mp4")

        // loadFFMPEG()

        if(video_data.tagName == "VIDEO"){
            video_res_obj = {height:video_data.videoHeight, width: video_data.videoWidth }  
        }else{
            video_res_obj = {height:video_data.naturalWidth, width: video_data.naturalHeight }
        }
        setVideoDimension(video_res_obj)
        setFontSize(videoDimension.height/11)
        if(text_placeholder) {
            setHeight(text_placeholder.clientHeight)
            setWidth(text_placeholder.clientWidth)
        }
        console.log(height, "height dont")
    }, [text])

    const typeText = (e) => {
        setText(e.target.value)
    }

    const groupWordsToSentence = (text_lst, font) => {
        let words = []
        let amount = getTextWidth(text_lst, font)
        console.log(amount)
        if( amount < videoDimension.width*1.1) return [text_lst.join(" ")]
       
        for (let i = 0; i < text_lst.length; i++) {
            console.log(text_lst)
            console.log(words)
            words.push(text_lst[i]);
            console.log(font)
            let size = getTextWidth(words.join(" "), font)
            console.log(size)
            // let size_num = parseInt(size.replace("px", ""))
            if(size > videoDimension.width*1.1 || i == text_lst.length-1){
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
        let font_size = (videoDimension.height/11)*1.2
        let font = `${font_size}pt arial`
        // const text_length =(getTextWidth(text_p.innerText, window.getComputedStyle(text_p).font));
        let sentences = groupWordsToSentence(text_lst, font)
        let drawtext_cmd = []
        
        sentences.forEach((elem, idx) => {
            let cmd = `drawtext=text='${elem}':fontfile=futura.ttf:fontcolor=black:fontsize=${font_size}:x=(w-text_w)/2:y=-${font_size}+${(idx+1)*((font_size)+6)}`
            // conWsole.log("hello")
            drawtext_cmd.push(cmd)
        })
        
        
        if(!ffmpeg.isLoaded()) await ffmpeg.load();
        
        ffmpeg.FS('writeFile', file.name, await fetchFile(file.preview));
        // let text = new Blob(["00:00:00,000 --> 00:00:10,000\nHello there good afternoon people"])
        let font_uint8 = b64ToUint8Array(FUTURA_TTF)
        ffmpeg.FS('writeFile', 'futura.ttf', font_uint8)
        await ffmpeg.run('-i', file.name,'-vf',`pad=w=iw:h=${(drawtext_cmd.length*((font_size)+6))}+ih:y=${(drawtext_cmd.length*((font_size)+6))}:color=white,${drawtext_cmd}`,'-vcodec','libx264','output.mp4')

        // await ffmpeg.run('-i', file.name,'-vf',`pad=w=iw:h=${(height)*(0.4+(drawtext_cmd.length*0.15))}+ih:y=${(height*(0.4+(drawtext_cmd.length*0.15)))}:color=white,${drawtext_cmd}`,'-vcodec','libx264','output.mp4')
        const data = ffmpeg.FS('readFile', 'output.mp4')
        
        ffmpeg = null
        saveAs(URL.createObjectURL(new Blob([data.buffer], {type: "video/mp4"})))
      };

      const generateImages = async (file, timeframe) =>{
        if(!ffmpeg.isLoaded()) await ffmpeg.load();
        let imageList = []
        let video_data = document.querySelector(".video_mp4")
        let frame_qty = 12
        // let imageAmount = Math.floor(video_data.duration)/timeframe
        let frameInterval = video_data.duration/frame_qty
        let numArr = Array.from({length:frame_qty},(v,k)=>k+1)
        let frameTimeStampList = numArr.map((item)=>{
            return item*frameInterval
        });
        console.log(frameTimeStampList)
        // console.log(imageAmount, "hello")
        for (let index = 1; index <= frameTimeStampList.length; index++) {
          
            let imgName = `image_.png`
            ffmpeg.FS('writeFile', file.name, await fetchFile(file.preview));
            await ffmpeg.run( '-ss',`${frameTimeStampList[index]}`,'-i', file.name, '-frames:v', '1', imgName)
            // console.log(imgName, frameTimeStamList[index])
            // await ffmpeg.run('-i', file.name,'-vf',`pad=w=iw:h=${(height)*(0.4+(drawtext_cmd.length*0.15))}+ih:y=${(height*(0.4+(drawtext_cmd.length*0.15)))}:color=white,${drawtext_cmd}`,'-vcodec','libx264','output.mp4')
            const data = ffmpeg.FS('readFile', imgName)
            let file_content = URL.createObjectURL(new Blob([data.buffer], {type: "image/jpg"}))
            imageList.push(file_content)
        }
        ffmpeg = null
        console.log(imageList)
        return imageList
      }

    return(
        
        <div>
            <div className="video_edit_container" style={{justifyContent: fadeAnimation? "center": null}}>
                {/* <VideoPlaceholder video={content} text={text} style={fadeAnimation}/> */}
            {!fadeAnimation? <div> 
                <VideoPlaceholder file={file} text={text} font={fontSize}/>
                    <div className="video_edit_options"  style={fadeAnimation}>
                        <div style={{height:"100px"}}>
                            {frames.map((frame)=> 
                                <img src={`${frame}`} style={{height:"70px", width: "70px"}}/>
                            )}
                       
                        </div>
                        <div>
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
                    </div>
                    </div>:
                <div style={{height: 200, width: 200, display: fadeAnimation? 'block':'none'}}>
                    <CircularProgressbar value={percentage} text={`${Math.round(percentage)}%`}/>
                </div>}
            </div>
        </div>
    )
}

export default VideoMenu