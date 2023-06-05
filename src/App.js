import React from 'react'
import { useState,useEffect } from 'react'
const App = () => {
  const [message,setMessage]= useState(null)
  const [value,setValue]= useState(null)
  const[previousChats,setPreviousChats]= useState([])
  const [currentTitle,setCurrentTitle]= useState(null)
  const getMessages=async()=>{
    const options= {
      method:"POST",
      body:JSON.stringify({
        messages:value
      }),
      headers:{
        "Content-Type":"application/json"
      }
    }
   try {
     const response = await fetch("http://localhost:8000/completions",options)
     const data= await response.json()
     setMessage(data.choices[0].message)
     console.log(message)
   } catch (error) {
     console.log(error)
   }
  
  }

  useEffect(()=>{
   console.log(currentTitle,message)
   if(!currentTitle && value && message){
     setCurrentTitle(value)
   }
   if(currentTitle && value && message){
    setPreviousChats(prevChats=>(
      [...prevChats, {
         title:currentTitle,
         role:"user",
         content:value
      },{
        title:currentTitle,
        role:message.role,
        content:message.content
      }]
    ))
   }



  },[message,currentTitle])
 
  const currentChat = previousChats.filter(previousChat=>previousChat.title === currentTitle)
 const uniqueTitles = Array.from( new Set(previousChats.map((previousChat=> previousChat.title))))
 console.log(uniqueTitles)

  const createNewChat =()=>{
    setMessage(null)
    setValue('')
    setCurrentTitle(null)
  }
  const handleClick= (uniqueTitle)=>{
    setMessage(null)
    setValue('')
    setCurrentTitle(uniqueTitle)
  }
  return (
  <div className="app">
    <section className='side-bar'>
    <button onClick={createNewChat}>+ New Chat</button>
    <ul className="history">
      {
        uniqueTitles?.map((uniqueTitle,index)=> <li  onClick={()=> handleClick(uniqueTitle)}
         key={index}>{uniqueTitle}</li>)
      }
    </ul>
   <nav>
    <p>Made By Segun</p>
   </nav>
  </section>
  <section className="main">
     {!currentTitle && <h1>SegunGPT</h1>}
    <ul className="feed">
       {
       currentChat?.map((chatMessage,index)=><li key={index}>
        <p className='role'>{chatMessage.role}</p>
        <p >{chatMessage.content}</p>
       </li>)
       }
    </ul>
    <div className="bottom-section">
      <div className="input-container">
        <input value={value} onChange={(e)=>setValue(e.target.value)}/>
        <div id="submit"
        onClick={getMessages}>&#10146;</div>
      </div>
      <div className="info">version 1.1.0</div>
    </div>
  </section>
  </div>

  )
}

export default App