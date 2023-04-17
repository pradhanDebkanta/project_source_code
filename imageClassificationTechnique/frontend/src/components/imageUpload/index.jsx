import React, { useState, useEffect } from 'react';
import { InboxOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { Button, } from 'antd';
import axios from 'axios';
import { Space, Spin } from 'antd';


const { Dragger } = Upload;

// const serverUrl = "https://33b0-2402-3a80-1102-9348-ad1b-ed1a-e32c-6805.ngrok-free.app/"

const ImageUpload = ({ endpoint }) => {
    const [imgUrl, setImgUrl] = useState("");
    const [imgName, setImgName] = useState("")
    const [isLoading, setLoading] = useState(false);
    const [predictionData, setPredictionData] = useState({});
    const [disableDragger, setDisableDragger] = useState(false);
    const [serverUrl, setServerUrl] = useState("")

    useEffect(() => {
        if (endpoint) {
            setServerUrl(endpoint);
        } else {
            setServerUrl(window?.localStorage?.getItem("baseUrl") ?? "https://kidney-stone-api.onrender.com/")
        }
    }, [endpoint])

    const props = {
        name: 'file',
        multiple: false,
        accept: 'image/jpeg',
        data: { upload_preset: 'hi99sfkm' },
        action: `https://api.cloudinary.com/v1_1/dstclmluk/image/upload`,

        onChange(info) {
            const { status } = info.file;
            if (status === 'uploading') {
                // console.log("uploading==>", info);
                setDisableDragger(true);
                setPredictionData({});
            }
            if (status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                console.log("done==>", info.file?.response);
                setImgUrl(info.file?.response?.secure_url);
                setImgName(`${info.file?.response?.original_filename}.jpg`)
                setDisableDragger(false);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
                setDisableDragger(false);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        disabled: disableDragger || isLoading,
        // showUploadList: true,
        // fileList: [],
    };

    const getPrediction = async () => {
        if (!imgUrl) {
            return;
        }
        try {
            setLoading(true);
            const { status, data } = await axios.post(`${serverUrl}get_prediction`, {
                img_url: imgUrl
            }, {
                withCredentials: false
            });
            console.log("res==>", status, data)
            setLoading(false);
            if (status >= 200 && status < 400 && data) {
                setPredictionData(data);
                message.success(`${imgName} is a ${data?.img_type} kidney.`);
            } else {
                setPredictionData({})
            }
        } catch (err) {
            console.error("error to get prediction==>", err.message);
            message.error(`something went wrong.`);
            setLoading(false);
        }
    }


    return (
        <div>
            <div className='d-flex justify-content-center mb-3'>
                {imgUrl && (
                    <div>
                        <div className='img-preview '>
                            <img src={imgUrl} alt='img-preview' className='img-fluid' />
                            {isLoading && (
                                <div className='loader-box'>
                                    <div className='d-flex justify-content-center align-items-center h-100'>
                                        <Space size="middle">
                                            <Spin size="large" tip="predictive.." />
                                        </Space>
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className='text-center'>{imgName}</p>
                    </div>
                )}
            </div>
            <div className='dragger-container'>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Upload only jpg formated file to get prediction
                    </p>
                </Dragger>
            </div>
            <div className='submit-btn mt-3 mb-3 d-flex justify-content-center'>
                <Button type="primary" shape="round" size={'large'}
                    onClick={() => { getPrediction() }}
                    disabled={isLoading || !imgUrl || predictionData?.img_type}
                >
                    Get prediction
                </Button>
            </div>
            {predictionData?.img_type && (
                <div className='result-box mt-3 mb-3'>
                    <div className='d-flex justify-content-center'>
                        <div className='pe-2'>
                            <CheckCircleOutlined style={{ color: 'green', fontSize: '24px' }} />
                        </div>
                        <h5 className='result'>
                            Result
                        </h5>
                    </div>
                    <p className='mb-0'>
                        Prediction: {predictionData.img_type}
                    </p>
                    <p className='mb-0'>
                        Kidney image {imgName}  has {predictionData.img_type}
                    </p>
                </div>
            )}
        </div>
    )
}

export default ImageUpload