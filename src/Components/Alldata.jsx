import React, { useEffect, useState } from "react";
import { Web5 } from "@web5/api/browser";
import { useLocation } from 'react-router-dom'
import '../App.css'



function Alldata() {
  const [web5, setWeb5] = useState(null);
  const [did, setDid] = useState();
  const [input, setInput] = useState();
  const [textData, setTextData] = useState([]);
const Location = useLocation();
const Mydid = Location.state.did;
const [imageUrls, setImageUrls] = useState([]);

useEffect(() => {
  const connectWeb5 = async () => {
    const { web5 } = await Web5.connect();
    setWeb5(web5);
    setDid(Mydid);
  };
  connectWeb5();
}, []);

useEffect(() => {
  console.log(web5);
}, [web5]);

// input
const handleChange = (e) => {
  setInput(e.target.value);
}

// it will record the data
const upload = async () => {
  const { record } = await web5.dwn.records.create({
    data: input,
    message: {
      schema: "http://127.0.0.1:5174",
      dataFormat: "text/plain",
    },
  });

  setInput(record);
  console.log(record);
}

// Fetching the data 
const fetch = async () => {
  try {
    const response = await web5.dwn.records.query({
      message: {
        filter: {
          schema: "http://127.0.0.1:5174",
        },
        dateSort: "createdAscending",
      },
    });

    console.log('blog post records', response);
    console.log("This is my response", response.records);

    const receivedDings = await Promise.all(
      response.records.map(async (record) => {
        const { data } = record;
        const textData = await data.text();
        return textData;
      })
    );

    setTextData(receivedDings);
    console.log(receivedDings);

  } catch (error) {
    
  }
};

  return (
   <>
   <div className='profile'>
   <h1>{Location.state.name}</h1>
   <img src={Location.state.img} alt=''/>
  
   <div className='sum'>
   <p className="Mydidl">{Location.state.did}</p>
   </div>
   </div>
   <div className="bigclass">
    <div className="textonly">
   <button onClick={fetch}>My Data</button>
   {textData && textData.map((text, index) => (
        <div key={index}>
          <p>{text}</p>
          <hr/>
        </div>
      ))}
      </div>
      </div>
   </>
  )
}

export default Alldata
