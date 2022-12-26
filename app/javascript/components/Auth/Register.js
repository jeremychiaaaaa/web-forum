import React,{useState,useEffect} from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { useSelector,useDispatch } from 'react-redux'
import { setNewUser } from '../../redux/actions'
import { useNavigate } from "react-router-dom";

const Container = styled.div`
    width:100vw;
    background:#fff2e5;
    height:100vh;
    position:absolute;
    left:0;
    top:0;
    display:flex;
    justify-content:center;
    align-items:center;

`

const Wrapper = styled.div`
    display:flex;
    flex-direction:column;
    width:${props=>props.phone ? '70%' : '30%'};
    justify-content:center;
    background-color:white;
    align-items:center;
    gap:5px;
    padding:30px 20px;
    border-radius:5px;
`

const InputField = styled.div`
    width:90%;
    
    
    border-radius:5px;
    z-index:10;

    input {
    width:100%;

    min-height:30px;
    border-radius: 4px;
    border: 1px solid #E6E6E6;
    margin: 12px 0;
    padding: 15px;
    }


`

const SignUpButton = styled.div`
    padding:15px;
    width:90%;
    margin-top:10px;
    border: 1px solid transparent;
    background-color: #ff7f50;
    color:white;
    border-radius:5px;
    font-weight:500;
    font-family:Poppins;
    font-size:1.1rem;
    text-align:center;
    cursor:pointer;
`


const Register = ({phone}) => {
   const navigate = useNavigate()
    //we will store the username  in the a temporary state then pass it to the redux store in the handleSubmit action
    
    const [temporaryUsername, setTemporaryUsername] = useState('')
    // state here will check if the password and the confirm password is the same
    const [confirmPassword, setConfirmPassword] = useState('')
    const [email,setEmail] = useState('')
    const dispatch = useDispatch()

    // state to handle profile pic of user and preview pic for user to see as they select it 


    const [profilePic,setProfilePic] = useState()
    const [previewImage,setPreviewImage] = useState()


    //state to store the password 

    const [password,setPassword] = useState('')
    const [errorMessage,setErrorMessage] = useState('')
    
    // regex expression here is to check if the file is a valid image type
    const imageValidationRegex = /image\/(png|jpg|jpeg)/gm;

    const handleImageChange = (e) => {
        
        setProfilePic((e.target.files[0]));
        setPreviewImage(URL.createObjectURL(e.target.files[0]))

    }
    
    
    // submit function to be login user using the api end point created in the rails backend 

    const handleSubmit = (e) => {
        e.preventDefault()
        
        const data = new FormData()

        data.append('user[username]', temporaryUsername)
        data.append('user[email]', email)
        data.append('user[password]', password)
        data.append('user[profile_pic]', profilePic)
      
      
        if(confirmPassword===password) {

        fetch('/api/v1/registrations',{
            method: 'POST',
            body: data
        }).then(res=>{
            if(res.ok){
               
                dispatch(setNewUser(true))
                navigate('/login')
            }else{
                setErrorMessage(res.json().data.errors)
            }
           
        }).catch(res=>{
            setErrorMessage('Please check that all fields have been filled in')
        })
            
        }else{
            setErrorMessage('Passwords do not match')
        }
        
    }





  return (
    <Container>

        <Wrapper phone={phone}>
            <span style={{fontFamily:'Poppins', fontSize:'1.2rem', fontWeight:600, padding:5}}>Create an account</span>
          
            <form onSubmit={handleSubmit} style={{width:'100%'}}>
            <InputField>
                <input type='text' required name='username' placeholder='Username'  onChange={e=>(setTemporaryUsername(e.target.value))} />
            </InputField>
            <InputField>
                <input type='email' required  name='email' placeholder='Email'  onChange={e=>(setEmail(e.target.value))} />
            </InputField>
            <InputField>
                    <input type='file' name='profilePic'  onChange={(e)=>handleImageChange(e)} />
            </InputField>
            <InputField>
                <input type='password' required name='password' placeholder='Password' value={password} onChange={e=>setPassword(e.target.value)}  />
            </InputField>
            <InputField>
                <input type='password' required name='password' placeholder='Confirm Password' value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}  />
            </InputField>
            {
                  previewImage 
                  &&
                  <div style={{alignSelf:'flex-start'}} >
                  <img style={{width:110,height:110,objectFit:'cover'}} src={previewImage} alt="" />
                  </div>
             
            }
            <SignUpButton onClick={handleSubmit}>
                Sign Up
            </SignUpButton>  
            </form>
            <span style={{fontFamily:'Poppins', color:'gray', fontSize:'0.9rem',marginTop:phone && 15}}>
                Already have an account? <span style={{fontWeight:600, color:'#ff7f50', textDecoration:'underline'}} onClick={()=>navigate('/login')}>Log In</span>
            </span>
            {
                errorMessage !== '' 
                &&
                <span style={{color:'red', fontSize:'0.9rem',fontWeight:600,color:'red'}}>
                    {errorMessage}
                </span>
            }
        </Wrapper>

    </Container>
  )
}

export default Register