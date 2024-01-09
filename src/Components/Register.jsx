import '../App.css';
import { Web5 } from "@web5/api/browser";
import React, { useEffect, useState } from "react";
import {  database } from './FirebaseConfig.js';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { storage } from './FirebaseConfig.js';
import { ref as dref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref, set } from 'firebase/database';



function Register() {
  const [image, setImage] = useState(null);
  const [web5, setWeb5] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    text: ''
  });
  const [did, setDid] = useState(null);
  const navigate = useNavigate();

  const handleConnect =async ()=>{
      const { web5, did } = await Web5.connect();
      setWeb5(web5);
      setDid(did);
  }

  useEffect(() => {
  }, [web5]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
  
      const uid = userCredential.user.uid;
  
      const imageRef = dref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);
  
      const userData = {
        username: formData.username,
        text: formData.text,
        email: formData.email,
        password: formData.password,
        url: url,
      };
  
      const userRef = ref(database, 'users/' + uid);
      await set(userRef, userData);
  
      setDid(formData.text);
      console.log(userRef + userData);
      alert('User created Successfully');
      navigate('/Home',{state:{did:formData.text}});
    } catch (error) {
      console.error('Error registering user:', error);
  
      // Check if 'path' property exists before accessing it
      if (error && error.path) {
        console.error('Error path:', error.path);
      }
  
      setDid('Registration failed. Please try again.');
    }
  };


  return (
    <>
      <div className='main'>
        <div className='body1'>
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                placeholder='Enter Your Name'
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <br />

            <div>
              <input
                placeholder='Enter Your email'
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <br />

            <div>
              <input
                placeholder='Enter Your Password'
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <br />
            <div>
              <input
                placeholder='Enter Your Did'
                type="text"
                name="text"
                value={formData.text}
                onChange={handleInputChange}
              />
            </div>
            <br />
            <input type="file" onChange={handleImageChange} />
            <label onClick={handleConnect}>Create Ur Did</label>
            <div className='Mydid'> <p>{did}</p></div>
           
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;