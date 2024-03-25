const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');



const socket = io();

const peer = new RTCPeerConnection({
    iceServers:[
        { urls: "stun:stun.stunprotocol.org" },
        { urls: "stun:stun.l.google.com:19302"},
        { urls: "stun:stun.services.mozilla.com"}
    ]
})

peer.ontrack = async ({streams: [stream]}) =>{
    console.log("on track running");
    remoteVideo.srcObject = stream;
    console.log(stream);
    remoteVideo.play();

    const myStream = await navigator.mediaDevices.getUserMedia({
        video : true,
    });
    for( const track of myStream.getTracks()){
        peer.addTrack(track, myStream);
    }
}

function getCandidate(event){
    if(event.candidate){
        console.log(event.candidate);
        socket.emit('candidate' , event.candidate);
    }

}

const createCall = async function(){

    peer.onicecandidate = getCandidate;
    

    const localOffer = await peer.createOffer();
    await peer.setLocalDescription(new RTCSessionDescription(localOffer));

    console.log("sendOffer sent");
    socket.emit('sendOffer', localOffer);
}

const recieveCall = async function(offer){
    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answerOffer = await peer.createAnswer();
    await peer.setLocalDescription(new RTCSessionDescription(answerOffer));
    
    console.log("sendanswer sent");
    socket.emit('sendAnswer' , answerOffer );
    
    const myStream = await navigator.mediaDevices.getUserMedia({
        video : true
    });
    // peer.addTrack( myStream.getTracks()[0], myStream);
    
    for( const track of myStream.getTracks()){
        console.log("adding tracks")
        peer.addTrack(track, myStream);
    }
}

const recieveAnswer = async function(answer){
    console.log("answer recieved");
    await peer.setRemoteDescription(new RTCSessionDescription(answer));
}


socket.on('createOffer' , ()=>{
    createCall();
})

socket.on('candidate' , candidate =>{
    var iceCandidate = new RTCIceCandidate(candidate);
    peer.addIceCandidate(iceCandidate);

})

socket.on('recieveOffer' , offer =>{
    recieveCall(offer);
} )

socket.on('recieveAnswer', answer =>{
    recieveAnswer(answer);
})
const getUserMedia = async () => {
    try {
        const userMedia = await navigator.mediaDevices.getUserMedia({
            video: { width: 1440, height: 1080 },
            audio:true
    
        });
        localVideo.srcObject = userMedia;
        localVideo.play();
        
    } catch (error) {
        alert("Unable to open camera!")
        
    }
}

window.addEventListener('load', getUserMedia);




// const localVideo = document.getElementById('localVideo');
// const remoteVideo = document.getElementById('remoteVideo');



// const socket = io('https://vc-p2p-app.glitch.me');

// const peer = new RTCPeerConnection({
//     iceServers:[
//         { urls: "stun:stun.stunprotocol.org" },
//         { urls: "stun:stun.l.google.com:19302"},
//         { urls: "stun:stun.services.mozilla.com"}
//     ]
// })

// peer.ontrack = async ({streams: [stream]}) =>{
//     console.log("on track running");
//     remoteVideo.srcObject = stream;
//     console.log(stream);
//     remoteVideo.play();

//     const myStream = await navigator.mediaDevices.getUserMedia({
//         video : true,
//     });
//     for( const track of myStream.getTracks()){
//         peer.addTrack(track, myStream);
//     }
// }

// const createCall = async function(){
//     const localOffer = await peer.createOffer();
//     await peer.setLocalDescription(new RTCSessionDescription(localOffer));

//     console.log("sendOffer sent");
//     socket.emit('sendOffer', localOffer);
// }

// const recieveCall = async function(offer){
//     await peer.setRemoteDescription(new RTCSessionDescription(offer));
//     const answerOffer = await peer.createAnswer();
//     await peer.setLocalDescription(new RTCSessionDescription(answerOffer));
    
//     console.log("sendanswer sent");
//     socket.emit('sendAnswer' , answerOffer );
    
//     const myStream = await navigator.mediaDevices.getUserMedia({
//         video : true
//     });
//     // peer.addTrack( myStream.getTracks()[0], myStream);
    
//     for( const track of myStream.getTracks()){
//         console.log("adding tracks")
//         peer.addTrack(track, myStream);
//     }
// }

// const recieveAnswer = async function(answer){
//     console.log("answer recieved");
//     await peer.setRemoteDescription(new RTCSessionDescription(answer));
// }


// socket.on('createOffer' , ()=>{
//     createCall();
// })

// socket.on('recieveOffer' , offer =>{
//     recieveCall(offer);
// } )

// socket.on('recieveAnswer', answer =>{
//     recieveAnswer(answer);
// })
// const getUserMedia = async () => {
//     try {
//         const userMedia = await navigator.mediaDevices.getUserMedia({
//             video: { width: 1440, height: 1080 },
//             audio:true
    
//         });
//         localVideo.srcObject = userMedia;
//         localVideo.play();
        
//     } catch (error) {
//         alert("Unable to open camera!")
        
//     }
// }

// window.addEventListener('load', getUserMedia);
