import React, { useState, useRef } from 'react';
import { CloudinaryContext, Video } from 'cloudinary-react';
import Loader from "./Loader";
import "./css/VideoInput.css";

const VideoInput = () => {
    const ipt = useRef();
    const [isLoading, setIsLoading] = useState(false);
    // const [videoUrl, setVideoUrl] = useState('https://res.cloudinary.com/dapwssjtf/video/upload/v1711824498/videos/headPositionDetection_ltpslu.mp4');
    const [videoUrl, setVideoUrl] = useState(null);
    const CLOUD_NAME = 'dapwssjtf';
    const handleVideoUpload = async () => {
        const file = ipt.current.files[0];
        if (!file) {
            alert('please upload a file!!');
            return;
        }
        setIsLoading(true);
        setVideoUrl(null);
        console.log(file);
        // Upload video to Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'aktizax6');

        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        console.log(data);
        setVideoUrl(data.secure_url);
    };
    return (
        <div className="video-input-main">
            <div className='video-input-cont'>
                <input ref={ipt} type="file" accept="video/*" />
                <button onClick={handleVideoUpload}>Upload</button>
                <Loader toLoad={isLoading && !videoUrl} />
                <div className='uploaded-video'>
                    {videoUrl && (
                        <CloudinaryContext cloudName={CLOUD_NAME}>
                            <Video className='my-video' publicId={videoUrl} controls />
                        </CloudinaryContext>
                    )
                    }
                </div>
            </div >
            <h1 className='text-center'>OR</h1>
            <div className="video-input-iframe-div">
                <iframe className='video-input-iframe' title='video-input-iframe' src="http://127.0.0.1:5001"></iframe>
            </div>
        </div>
    );
};

export default VideoInput;
