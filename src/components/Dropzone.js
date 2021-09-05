import MP4Img from '../img/mp4.png'
import {useDropzone} from 'react-dropzone'


const DropZone = ({setFiles, setIsLoading}) => {
    
    const {draggedFiles, getRootProps, getInputProps, isDragActive, isDragReject} = useDropzone({
        accept: "image/gif, video/mp4, video/webm",
        onDrop: (acceptedFiles) =>{
            console.log(acceptedFiles, 'fasdfsf')
            var reader = new FileReader();
            reader.readAsDataURL(acceptedFiles[0]);
            console.log(reader)
            setFiles(
                acceptedFiles.map((file) => 
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                    base64: reader
                }))
            )
            setIsLoading(true)
            console.log(draggedFiles)
        },
        init: ()=>{
            console.log("uploadComplete")
        }

    })
   
    // const images = files.map((file) => (
    //     <div key={file.name}>
    //         <div>
    //             {/* <img src={file.preview} style={{width: "200px"}} alt="preview"/> */}
    //             <video src={file.preview} style={{width: "500px"}}>
    //                 {/* <source s type="video/mp4"/> */}
    //             </video>
    //         </div>
    //     </div>
    // ))


    return(
        
        <div className="wrapper">
            <div className="content_text">
                <h1> <span>No</span> fancy video options</h1>
                <h1> <span>No</span> watermarks</h1>
                <h1> <span>Just</span> upload a gif/mp4, put text and </h1>
                {/* <h1><span>Good</span> to go !</h1>     */}
            </div>
            <div className="drop_container">
                <div className="drop_box">
                    <div {...getRootProps()}>
                        <input {...getInputProps()}/>
                        <div className="action_btn">
                            <img src={MP4Img} style={{width: "60px"}}/>
                            <button className="file_btn"/>
                        { isDragActive? 
                            <h4>Drop here!</h4>:
                            <h4>Or just drop your file!</h4>}
                        </div>  
                    </div>
                </div>
            </div>
            
            {/* <div>{images}</div> */}
        </div>
        
    )
}

export default DropZone