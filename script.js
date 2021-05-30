let videoPlayer = document.querySelector("video");
let constraints = {video:true};
let recordVideo = document.querySelector("#record-video");
let recordingState = false;
let mediaRecorder;
let recordedData;
let photoCapture = document.querySelector("#capture-photo");
let minScale = 1;
let currScale = 1;
let maxScale = 3;
let zoomIn = document.querySelector("#in");
let zoomOut = document.querySelector("#out");

(async function(){
    // for giving permission to media 
    let mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    videoPlayer.srcObject = mediaStream;

    mediaRecorder = new MediaRecorder(mediaStream, {mimeType: "video/webm; codecs=vp9"});
    mediaRecorder.onstart = function(e){
        console.log("recording started !!");
        console.log(e);
    }
    mediaRecorder.onstop = function(e){
        console.log("recording stopped !!");
        console.log(e);
    }
    mediaRecorder.ondataavailable = function(e){
        console.log("data available !!");
        console.log(e);
        recordedData = e.data;
        saveTofs();
    }
    recordVideo.addEventListener("click", function(){
        if(recordingState){
            mediaRecorder.stop();
            recordVideo.querySelector("div").classList.remove("record-animate");
        }else{
            mediaRecorder.start();
            recordVideo.querySelector("div").classList.add("record-animate");
        }
        recordingState = !recordingState;
    })
        // console.log(mediaRecorder);
    photoCapture.addEventListener("click", capturePhotos);

    zoomIn.addEventListener("click", function(){
        if(currScale + 0.1 <= maxScale){
            currScale += 0.1;
            videoPlayer.style.transform = `scale(${currScale})`;

        }
    })

    zoomOut.addEventListener("click", function(){
        if(currScale - 0.1 >= minScale){
            currScale -= 0.1;
            videoPlayer.style.transform = `scale(${currScale})`;

        }
    })


})();

function saveTofs(){
    
    // file object in recordedData
    let videoUrl = URL.createObjectURL(recordedData );
    let iv = setInterval(function() {
        if(db){
            saveMedia("Video", videoUrl);
            clearInterval(iv);
        }
        
    }, 100);

    // let aTag = document.createElement("a");
    // aTag.download = "video.mp4";
    // aTag.href = videoUrl;

    // aTag.click(); 
    
}
function capturePhotos(){
    photoCapture.querySelector("div").classList.add("capture-animate");
    setTimeout(function(){
        photoCapture.querySelector("div").classList.remove("capture-animate");
    }, 1000)
    let canvas = document.createElement("canvas");
    canvas.height = videoPlayer.videoHeight;
    canvas.width = videoPlayer.videoWidth;
  
    let ctx = canvas.getContext("2d");


    //canvas is scaled
    if(currScale != 1){
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.scale(currScale, currScale);
        ctx.translate(-canvas.width/2, -canvas.height/2)
    }




    ctx.drawImage(videoPlayer, 0, 0);
    let imageUrl = canvas.toDataURL("image/jpg"); //canvas object => file url String
    let iv = setInterval( function(){
        if(db){
          saveMedia("image" , imageUrl);
          clearInterval(iv);
        }
      }  , 100 );
    // let aTag = document.createElement("a");
    // aTag.download = "photo.jpg";
    // aTag.href = imageUrl;
    // aTag.click();
}

