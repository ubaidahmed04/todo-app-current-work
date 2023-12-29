import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {auth,doc,onAuthStateChanged,signOut,collection, addDoc,getDoc,db  ,query,where, updateDoc ,deleteDoc ,deleteField ,onSnapshot ,getDocs} from "../firebase.js"
let name = document.getElementById("name")
// let main = document.getElementById("main")
// let loader = document.getElementById("loader")
let DeleteAllbtn = document.getElementById("DeleteAllbtn")
let todoArray = []
const firebaseConfig = {
        apiKey: "AIzaSyCLcTooIOuWhV3zVoicJlm82bX711BmqE8",
        authDomain: "new-login-project-b5de9.firebaseapp.com",
        projectId: "new-login-project-b5de9",
        storageBucket: "new-login-project-b5de9.appspot.com",
        messagingSenderId: "440992145032",
        appId: "1:440992145032:web:e49b4812c8996e994b493d"
    };
    const app = initializeApp(firebaseConfig);
    var uid ;
onAuthStateChanged(auth, async(user) => {
    if(!user){
    location.replace("../index2.html")
  } 
   else if (user) {
        // main.style.display ="block"
        // loader.style.display ="none"
         uid = user.uid;
        console.log("userid",uid)
        console.log("username",user.displayName)
        // name.innerHTML = user.displayName
        console.log(user)
        filterTodo(uid)

const docRef = doc(db, "users", user.uid);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
  // console.log(user.uid)
  name.innerHTML = docSnap.data().username;
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
}
        // name.innerHTML = user.email.slice(0,user.emial.indexOf("@"))

    } 
})
// console.log(username)
let signoutbtn  = document.getElementById("signoutbtn");
function signout(){
// const auth = getAuth();
signOut(auth).then(() => {
  // Sign-out successful.
  location.replace("../signin/login2.html")
}).catch((error) => {
  // An error happened.
  console.log(error)
});
}
signoutbtn.addEventListener('click',signout)

// new code 

let list = document.getElementById("list")
// console.log(delbtn)
let todoFunc = async() =>{
    let todo = document.getElementById("todo")
    let addTodo = document.getElementById("addTodo")
    // console.log(todo.value)
    // todo.value = ""
    const docRef = await addDoc(collection(db, "generateTodo"), {
        newtodo:todo.value,
        uid ,

      });
      
      console.log("Document written with ID: ",docRef.id);
        
    }
    let getAlltodo = () =>{
      const q = collection(db, "generateTodo");
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const generateTodo = [];
        list.innerHTML = ""
        querySnapshot.forEach((doc) => {
          generateTodo.push(doc.data().newtodo);
          
        });
       
      });
}
getAlltodo();

addTodo.addEventListener('click' ,todoFunc)

async function deletebtn (){
  let delbtn = document.querySelectorAll(".delbtn")
  console.log(delbtn)
  
  const q = collection(db, "generateTodo");
  const querySnapshot = await getDocs(q);
// console.log(querySnapshot.docs)
  delbtn.forEach((delElem,i) => {
    delElem.addEventListener("click",()=>delBtnFunc(querySnapshot.docs[i].id))
    // console.log(querySnapshot.docs[i].id,"doc")
   
  });
}
// npm install -g create-react-app
// create-react-app "project name"
// cd   project name
// npm start 

async function delBtnFunc (id){
  // console.log(id)
  await deleteDoc(doc(db, "generateTodo", id));
}
let deleteAllbtn = document.getElementById("deleteAllbtn")
async function deleteAllTodoFunc(){
  const q = collection(db, "generateTodo");
  const querySnapshot = await getDocs(q);
  // console.log(querySnapshot.docs)
  querySnapshot.docs.forEach((doc) => {
    // console.log(doc.id)
    deleteAllTodo(doc.id)
  });

}
async function deleteAllTodo(id){
  await deleteDoc(doc(db, "generateTodo", id));
}
deleteAllbtn.addEventListener('click' ,deleteAllTodoFunc)


async function editTodo (){
  let editbtn = document.querySelectorAll(".editbtn")
  console.log(editbtn)
  
  const q = collection(db, "generateTodo");
  const querySnapshot = await getDocs(q);
// console.log(querySnapshot.docs)
editbtn.forEach((editElem,i) => {
    editElem.addEventListener("click",()=>editBtnFunc(querySnapshot.docs[i].id))
    // console.log(querySnapshot.docs,"doc")
  });
}

async function editBtnFunc (id){
  console.log(id)
const docRef = doc(db, "generateTodo", id);
const docSnap = await getDoc(docRef);
// console.log(docSnap)
// console.log(docRef)
if (docSnap.exists()) {
  let edit = prompt("Enter Your update Todo",docSnap.data().newtodo)
 
  console.log("Document data:", docSnap.data().newtodo);
  const washingtonRef = doc(db, "generateTodo", id);
  await updateDoc(washingtonRef, {
    newtodo: edit
  
  });
} else {
  console.log("No such document!");
}
}


// todos filter 
// const q = query(collection(db, "users"), where("userId", "==", uid));
//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const generateTodo = [];
//       querySnapshot.forEach((doc) => {
//           console.log(doc.data(),"data");
//       }); 
//     })
function filterTodo(uid){

  
  const q = query(collection(db, "generateTodo"), where("uid", "==", uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const generateTodo = [];
      querySnapshot.forEach((doc) => {
        generateTodo.push(doc.data());
        // console.log("doc.data",doc.data().newtodo)
        list.innerHTML += ` <li class="list-group-item">${doc.data().newtodo} <button class="delbtn btn btn-primary">delete</button> <button class="editbtn btn btn-success">edit</button></li>`
      });
      
      deletebtn()
      editTodo()
      // console.log("Current cities in CA: ", generateTodo.join(", "));
    });
    
  }
// const q = query(collection(db, "users"), where("userId", "==", uid));

// const unsubscribe = onSnapshot(q, (querySnapshot) => {
//   const generateTodo = [];
//   querySnapshot.forEach((doc) => {
//     // Assuming you have a "todos" subcollection for each user
//     const todosCollectionRef = collection(db, "users", doc.id, "todos");

//     // Add a new todo for the user
//     addDoc(todosCollectionRef, {
//       todo: input.value,
//       // Add other fields as needed
//     })
//     .then((docRef) => {
//       console.log("Todo added successfully:", docRef.id);
//     })
//     .catch((error) => {
//       console.error("Error adding todo: ", error);
//     });

//     // If you only want to log the user's data, you can keep the following line
//     console.log(doc.data(), "data");
//   });
// });

// Remember to unsubscribe when you no longer need the snapshot listener
// unsubscribe();


















//
// // let todoAdd = document.getElementById("todoAdd")
// // let todoFunc = async() =>{
// //   let input = document.getElementById("input")
// // //   console.log(input.value)
// //   const docRef = await addDoc(collection(db, "todos"), {
// //     todo: input.value,
// // });
// // console.log("Document written with ID: ", docRef.id);  
// // console.log(input.value)

// // }
// // todoAdd.addEventListener('click',todoFunc);

// // new code 

// // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
 
// // import { getAuth ,createUserWithEmailAndPassword ,signInWithEmailAndPassword,sendEmailVerification,
//   //      signInWithPopup, GoogleAuthProvider
//     //  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// // import { getFirestore,setDoc , addDoc,collection , updateDoc ,deleteDoc ,deleteField  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// // import {addDoc,setDoc,doc,docRef,collection,db,getFirestore,auth} from "./firebase.js"
//       // Initialize Firebase
// //       const db = getFirestore(app)
//       // const auth = getAuth(app)

// let todoAdd = document.getElementById("todoAdd")

// let addTodo =async ()=>{   

//         let todoInput = document.getElementById("input")
//         console.log(todoInput.value)

//         // firebase
     
//     // // You can perform additional actions with the document ID here
//     // const docRef = await addDoc(collection(db, "todos"), {
//     //         todo: todoInput.value,
//     //     });
//     //     console.log("Document written with ID: ", docRef.id);  

//     //     // get data

//     //     // const getref = doc(db, "todos", "getref");
//     //     const docSnap = await getDoc(docRef);
        
//     //     if (docSnap.exists()) {
//     //         var getTodo = docSnap.id
//     //         console.log("todo Id ",docSnap.id)
//     //       console.log("Document data:", docSnap.data());
//     //     //   list.innerHTML += docSnap.data().todo.value
//     //     } else {
//     //       // docSnap.data() will be undefined in this case
//     //       console.log("No such document!");

//         }
        

//         // 
//         // const collectionRef = db.collection('todos');
        
//         // collectionRef.get().then((querySnapshot) => {
//         //         querySnapshot.forEach((doc) => {
//         //                 console.log(doc.id);      
//         //         });
//         // }).catch((error) => {
//         //         console.error("Error getting documents: ", error);
//         // });
//         // todoAdd.addEventListener('click',addTodo,(e)=>{
//         // e.preventDefault()
//         // if input empty 
//         if(input.value !==""){

//         let liElem = document.createElement("li");
//         var liText = document.createTextNode(todoInput.value)
//         // console.log(liText)
//         // })
//         liElem.appendChild(liText)
//         console.log(liElem)

        
//         let list = document.getElementById("list")
//         list.appendChild(liElem)
//         input.value =""
//         // list.appendChild(liElem)


// // delete btn

// // Delete button creation
// let delbtn = document.createElement("button");
// let deltext = document.createTextNode("Delete");
// let itemId ="deleteBtn"; // Replace 123 with the actual id you want to pass

// // Set the id attribute of the button
// delbtn.setAttribute("id", "deleteBtn_" + itemId);

// // Append text node and button to li element
// delbtn.appendChild(deltext);
// liElem.appendChild(delbtn);

// // Delete button functionality
// let delItem = async(event) => {
        
//     let clickedButton = event.target;

//     await deleteDoc(doc(db, "todos", getTodo));
//     let itemId = clickedButton.id.split("_")[1]; // Extract the item id from the button's id
//     let listItem = clickedButton.parentNode;
    
//     console.log(listItem);
//     alert("Are you sure you want to delete this todo with id: " + itemId);
//     listItem.remove();
// }

// // Add event listener to the delete button
// delbtn.addEventListener('click', delItem);


// // new code using id edit btn

// // Edit button creation
// let editBtn = document.createElement("button");
// let editText = document.createTextNode("Edit");
// editBtn.appendChild(editText);
// liElem.appendChild(editBtn);


// // Set the id attribute of the button
// editBtn.setAttribute("id", "editBtn_" + itemId); // Assuming you have an itemId variable

// // Edit button functionality
// let editItem = async(event) => {
//     let clickedButton = event.target;
//     let listItem = clickedButton.parentNode;
    
//     console.log(listItem);
//     // const updated = doc(db, "todos", docRef);
    
//     // Set the "capital" field of the city 'DC'
//     //   await updateDoc(updated, {
//         //  todo: true
//         //});
//     let editValue = prompt("Enter your updated Value", listItem.firstChild.nodeValue);
    
//     if (editValue !== null) { // Check if the user clicked cancel
//         listItem.firstChild.nodeValue = editValue;
//     }
// };

// // Add event listener to the edit button
// editBtn.addEventListener('click', editItem);



// }
// else{
//     alert("please enter valid todo")
// }
// }
// todoAdd.addEventListener('click',addTodo)

// let getAllData = async () =>{
//   const q =  collection(db, "todos");
//   const unsubscribe = onSnapshot(q, (querySnapshot) => {
//     const todos = [];
//     querySnapshot.forEach((doc) => {
//         todos.push(doc.data());
//     });
//     console.log("show data todos -->", doc.data().value)
//   });
  
// };
// getAllData()
// // delete All functionality
// let deleteAll = async(D) =>{
//     let list = document.getElementById("list")
//     const docSnap = await getDoc(docRef);

//     var getTodo = docSnap.id
    
//     await deleteDoc(doc(db, "todos", getTodo));
    
//     if(deleteAll){
//         alert("Are you sure you want to delete all todo")
//         list.innerHTML=""
        
//     }else{
//         // list.appendChild(liElem)
        
//     }
// }
// DeleteAllbtn.addEventListener('click',deleteAll)

// // // delete btn functionality

// // let delItem = (D) =>{
// //         console.log(D.parentNode)
// //         alert("Are you sure you want to delete this todo")
// //         D.parentNode.remove()
// // }
// // let delValue = document.getElementById("delItem")
// // delValue.addEventListener('click' ,delItem )
// // edit btn functionality

// // let editItem = (E)=>{
// //         console.log(E.parentNode)
// //         console.log(input.value)
// //         let editValue =prompt("Enter your updated Value",input.value)
// //         console.log(editValue)
// //         E.parentNode.firstChild.nodeValue= editValue

// // }




