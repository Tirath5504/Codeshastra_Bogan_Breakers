import React, { useState, useRef } from 'react';
import { CloudinaryContext, Video } from 'cloudinary-react';

const UploadVideo = () => {
    const ipt = useRef();
    const [videoUrl, setVideoUrl] = useState('');
    const CLOUD_NAME = 'dapwssjtf';
    const handleVideoUpload = async () => {
        const file = ipt.current.files[0];
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
        <div className='video-input-cont'>
            <input ref={ipt} type="file" accept="video/*" />
            <button onClick={handleVideoUpload}>Upload</button>
            {videoUrl && (
                <CloudinaryContext cloudName={CLOUD_NAME}>
                    <Video publicId={videoUrl} controls />
                </CloudinaryContext>
            )
            }
        </div >
    );
};

export default UploadVideo;
