"use client"
import React, { useEffect, useRef, useState } from 'react'

export function CameraView() {

  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const cameraCanvasRef = useRef<HTMLCanvasElement>(null);
  const [Img, setImg] = useState("")

  useEffect(() => {
    openMedia() //打开摄像头
  }, [])

  function successFunc(mediaStream: MediaStream) {
    const video = cameraVideoRef.current;
    // const video = document.getElementById('cameraVideo') as HTMLVideoElement;
    // 旧的浏览器可能没有srcObject
    if ('srcObject' in video!) {
      video.srcObject = mediaStream;
    }
    video!.onloadedmetadata = () => {
      video!.play();
    };
  }

  // 启动摄像头
  const openMedia = () => { // 打开摄像头
    const opt = {
      audio: false,
      video: {
        width: 1920,
      }
    };
    navigator.mediaDevices.getUserMedia(opt)
      .then(successFunc)
      .catch((err) => {
        console.log(`${err.name}: ${err.message}`)
      });
  };
  // 关闭摄像头
  const closeMedia = () => {
    const video = cameraVideoRef.current;
    const stream = video!.srcObject;
    if ('getTracks' in stream!) {
      const tracks = stream.getTracks();
      tracks.forEach(track => {
        track.stop();
      });
    }
  };

  const getImg = () => { // 获取图片资源
    const video = cameraVideoRef.current;
    const canvas = cameraCanvasRef.current;
    if (canvas == null) {
      return;
    }
    const ctx = canvas.getContext('2d');
    ctx!.drawImage(video!, 10, 0, 300, 150); // 把视频中的一帧在canvas画布里面绘制出来
    const imgStr = canvas.toDataURL(); // 将图片资源转成字符串
    const base64Img = imgStr.split(';base64,').pop(); // 将图片资源转成base64格式
    const imgData = {
      base64Img
    };
    // closeMedia(); // 获取到图片之后可以自动关闭摄像头
    return imgData;
  };


  const saveImg = () => { // 保存到本地
    const data = getImg();
    setImg('data:image/png;base64,' + data!.base64Img)
  };


  return (
    <div>
      <div className='PaiZhao'>
        <video
          id="cameraVideo"
          ref={cameraVideoRef}
          className='PaiZhao_video'
        />
      </div>
      <div className='PaiZhao'>
        <canvas
          id="cameraCanvas"
          ref={cameraCanvasRef}
          className='PaiZhao_canvas'
        />
      </div>

      <img id="imgTag" src={Img} alt="imgTag" />
      <button onClick={() => {
        saveImg()
        // closeMedia()
      }} >保存</button>
      <button onClick={() => { closeMedia() }} >关闭摄像头</button>
    </div>
  )
}