import React, { useState } from 'react';
import ImageUpload from './components/imageUpload';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { EditOutlined } from '@ant-design/icons';
import { Modal, Input } from 'antd';

function App() {
  const [open, setOpen] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [error, setError] = useState("")
  const [endpoint, setEndPoint] = useState("")

  const showModal = () => {
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
  };

  const onClickOk = () => {
    if (baseUrl) {
      window?.localStorage.setItem("baseUrl", baseUrl);
      setEndPoint(baseUrl);
      hideModal();
    } else {
      setError('error');
      return;
    }
  }

  return (
    <div className="app container">
      <div className='edit-url'>
        <EditOutlined
          style={{ color: '#1677ff', fontSize: '20px', cursor: 'pointer' }}
          onClick={() => { showModal() }}
        />
      </div>
      <div className='d-flex justify-content-center mb-2'>
        <h5 className='header'>
          Kidney Stone Detection using CNN
        </h5>
      </div>
      <div className='project-desc'>

      </div>
      <div className='img-uploader mt-2'>
        <ImageUpload endpoint={endpoint} />
      </div>
      <Modal
        title="Set api endpoint"
        open={open}
        onOk={() => onClickOk()}
        onCancel={hideModal}
        okText="Submit"
        cancelText="Cancle"
      >
        <div>
          <Input placeholder="Enter api end-point" status={error}
            onChange={(e) => {
              // console.log("value==>", e.target.value);
              setBaseUrl(e.target.value);
              setError("");
            }}
          />
        </div>
      </Modal>
    </div>
  );
}

export default App;
