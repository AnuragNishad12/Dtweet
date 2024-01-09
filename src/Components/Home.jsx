import React,{useState,useEffect, ChangeEvent} from 'react'
import '../App.css'
import Logo from '../img/logo2.png'
import { Web5 } from "@web5/api/browser";
import { ref as dref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database,auth } from './FirebaseConfig.js';
import { storage } from './FirebaseConfig.js';
import { ref, onValue, push} from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import {  useLocation } from 'react-router-dom'

function Home() {
  const Location = useLocation();
  const navigate = useNavigate();
 
  const [allUsers , setAllUsers] = useState([]);

  const [userData, setUserData] = useState(null);
  const [allUsersPosts, setAllUsersPosts] = useState([]);
  const [userImage, setUserImage] = useState(null);
  const [userList, setUserList] = useState([]);
  const [formData, setFormData] = useState({
    text: ''
  });
  const [image, setImage] = useState(null);
  const [input, setInput] = useState();
  const Mydid = Location.state.did;
  const [web5, setWeb5] = useState(null);
  const [did, setDid] = useState();

  useEffect(() => {
    const connectWeb5 = async () => {
      const { web5} = await Web5.connect();
      setWeb5(web5);
      setDid(Mydid);
    };
    connectWeb5();
  }, []);

  useEffect(() => {
    console.log(web5);
  }, [web5]);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const userRef = ref(database, `users/${userId}`);

      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setUserData(data.username);
        setUserImage(data.url);
        console.log(data.username);
      });
    } else {
      setUserData(null);
    }
  }, [userData]);

const handleNavigate=async ()=>{
  navigate('/UserData',{state:{name:userData,img:userImage,did:did}});
}

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      console.log('Selected image:', e.target.files[0]);
      setImage(e.target.files[0]);
    } else {
      console.log('No image selected');
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        let imgURL = '';
        if (image) {
          const imageRef = dref(storage, `images2/${image.name}`);
          await uploadBytes(imageRef, image);
  
          // Set imgURL only if an image is present
          imgURL = await getDownloadURL(imageRef);
        }
      
            const userData2 = {
              username: userData,
              text: formData.text,
              url: userImage,
              img:imgURL,
            };
            const userRef2 = ref(database, `users2/${user.uid}/posts`);
            await push(userRef2, userData2);
    
            onValue(userRef2, (snapshot) => {
              const data = snapshot.val();
              setUserList(data);
            });
        }
    } catch (error) {
      console.log('This is not working : ', error);
    }
    const { record } = await web5.dwn.records.create({
      data: formData.text,
      message: {
        schema: "http://127.0.0.1:5174",
        dataFormat: "text/plain",
      },
    });

    setInput(record);
    console.log(record);
    
    if(image !=null){
      const imageblob = new Blob([input], { type: 'image/png' }); 
      const { record } = await web5.dwn.records.create({ 
        data: imageblob, 
        message: { 
          schema: "http://127.0.0.1:2003", 
          dataFormat: 'image/png', 
        }, 
    
      }); 
      const { status: imagestatus } = await record.send(Mydid);
            console.log(imagestatus);
      setInput(record); 
      console.log(record); 
     } 
    
  
    }

  useEffect(() => {
    const userRef2 = ref(database, `users2/${auth.currentUser.uid}/posts`);
    onValue(userRef2, (snapshot) => {
      const data = snapshot.val();
      setUserList(data);
    });
  }, [auth.currentUser?.uid]);

  useEffect(() => {
    const postsRef = ref(database, 'users2');
    onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      // console.log(data);
      if (data) {
        const allPosts = Object.values(data).flatMap((user) => Object.values(user.posts || {}));
        setAllUsersPosts(allPosts);
      }
    });
  }, []);

   



  


  return (
    <>
    <div className='HomeBack'>
        <nav>
            <div className='logo'>
                <img src={Logo} alt=''/>
            </div>
            <div className='text'>
            <p>Explore The Dtweet</p>
        </div>
        <div className='User' onClick={handleNavigate}>
            <img src={userImage} alt='image'/>
            <p>{userData}</p>
        </div>
        </nav>
        <div className='body2'>
        <div className='post'>
        <div className='writePost'>
          <div className='profilePost'>
            <img src={userImage} alt=''/>
            <input  placeholder='What is Happenings?!'  type="text"
                name="text"
                value={formData.text}
                onChange={handleInputChange}/>
          </div>
          <div className='profileBottom'>
          <input type="file" onChange={handleImageChange} />
            <button onClick={handlePost}>Post</button>
          </div>
        </div>
        <hr/>
        {userList && (
  <div className='fetchPost2'>
    {Object.values(userList).map((post) => (
      <div className="fetchPost" key={post.id}>
        <div className='userValue'>
          <img src={post.url} alt=''/>
          <p>{post.username}</p>
        </div>
        <div className='postValue'>
          <p>{post.text}</p>
          {post.img && <img src={post.img} alt='post image' />}
        </div>
        <hr/>
      </div>
    ))}
  </div>
)}
{allUsersPosts && (
  <div className='fetchPost'>
    {Object.values(allUsersPosts)
      .filter((post) => post.username !== userData)
      .map((post) => (
        <div className="fetchPost" key={post.id}>
        <div className='userValue'>
          <img src={post.url} alt=''/>
          <p>{post.username}</p>
        </div>
        <div className='postValue'>
          <p>{post.text}</p>
          {post.img && <img src={post.img} alt='post image' />}
        </div>
        <hr/>
      </div>
      ))}
  </div>
)}
        </div>
        <div className='search'>
            <div className='search2'>
              <h1>All Users Here</h1>
{allUsersPosts && (
  <div className='fetchPost'>
    {Object.values(allUsersPosts)
      .filter((post) => post.username !== userData)
      .reduce((uniqueUsers, post) => {
        // Check if the user is not already in the uniqueUsers array
        if (!uniqueUsers.some((user) => user.username === post.username)) {
          uniqueUsers.push(post);
        }
        return uniqueUsers;
      }, [])
      .map((post) => (
        <div className="fetchPost" key={post.id}>
          <div className='userValue'>
            <img src={post.url} alt=''/>
            <p>{post.username}</p>
          </div>
          <div className='postValue'>
          </div>
          <hr/>
        </div>
      ))}
  </div>
)}
  </div>
  </div>
    </div>
    </div>
   
    </>
  )
}

export default Home