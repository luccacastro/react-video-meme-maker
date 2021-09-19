

const VideoEditOptions = () => {
    return(
        <div>
            <textarea className="glowing-border" rows="4" cols="28" onChange={typeText}></textarea>
                <select name="cars" id="cars">
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                </select>
            <button className="download_btn" onClick={doTranscode}> DOWNLOAD VIDEO</button> 
        </div>
    )
}

export default VideoEditOptions