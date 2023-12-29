import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getStorage, ref,uploadBytesResumable,getDownloadURL  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
const firebaseConfig = {
    apiKey: "AIzaSyCLcTooIOuWhV3zVoicJlm82bX711BmqE8",
    authDomain: "new-login-project-b5de9.firebaseapp.com",
    projectId: "new-login-project-b5de9",
    storageBucket: "new-login-project-b5de9.appspot.com",
    messagingSenderId: "440992145032",
    appId: "1:440992145032:web:e49b4812c8996e994b493d"
  };
  
  const app = initializeApp(firebaseConfig);
  const storage = getStorage();
  
  let UploadToStorage =(file) =>{
    return new Promise ((resolve,reject)=>{
   let fileName = file.name
   console.log(fileName)

   const storageRef = ref(storage, `users/uid`);
   const uploadTask = uploadBytesResumable(storageRef, file);
   uploadTask.on('state_changed', 
   (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    reject(error)
  }, 
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      resolve(downloadURL)
    });
  }
);
})
}

let uploadimage = async ()=>{
  let file = document.getElementById("file")
  console.log()
  let url = await UploadToStorage(file.files[0])
  console.log("url ----->",url)
}

let uploadBtn = document.getElementById("uploadBtn")

uploadBtn.addEventListener('click' ,uploadimage)

let file = document.getElementById("file")

file.addEventListener("change",(e)=>{
  let image = document.getElementById("displayImg")
  
  image.src = URL.createObjectURL(e.target.files[0])
})
