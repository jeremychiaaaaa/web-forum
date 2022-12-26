import React, {useState,useEffect} from 'react'
import axios from 'axios'
import styled from 'styled-components'
import Dropdown from './Dropdown/Dropdown';
import { setAllCategories } from '../../redux/actions';
// shall use the react-select library for the users to select a category to tag to their post 
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
    width:100vw;
    background:#fff2e5;
    height:110vh;
    position:absolute;
    left:0;
    top:0;
    display:flex;
    justify-content:center;
    align-items:center;
    transform: ${props=>props.phone && 'translateY(-50px)'};

`

const FormWrapper = styled.div`

    width:80%;
    background-color: #fff;
  
    display:flex;
    flex-direction:column;
    align-items:center;
    border-radius:5px;
    padding:30px 20px;
    gap:10px;
    

`

const InputField = styled.div`
    width:90%;
    
    
    border-radius:5px;
    z-index:10;

    input {
    width:100%;

    min-height:10px;
    border-radius: 4px;
    border: 1px solid #E6E6E6;
    margin: 12px 0;
    padding: 15px;
    font-family:Poppins;
    }

    textarea {
        width: 100%;
        min-height:80px;
        border-radius: 4px;
        border: 1px solid #E6E6E6;
        margin: 12px 0;
        padding: 15px;      
        font-family:Poppins;
      }
`

const SubmitButton = styled.div`
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




const CreatePost = ({phone}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {username,allCategories} = useSelector(state=>state.userReducer)
    // state to handle title of post
    
    const [title,setTitle] = useState('')

    // state to handle description of post

    const [description,setDescription] = useState('')

    // state to handle image to be previewed and uploaded
    const [images,setImages] = useState('')
    const [previewImage,setPreviewImage] = useState()

    // state to handle category choose (must be in id form)
    
    const [categoryChoose,setCategoryChoose] = useState()
    const [categoryIDChoose,setCategoryIDChoose] = useState()
    const [allCats,setAllCats] = useState([])
    // state to manage errors in the form

    const [error,setError] = useState('')


    // regex expression here is to check if the file is a valid image type
    const imageValidationRegex = /image\/(png|jpg|jpeg)/gm;

    const handleImageChange = (e) => {
        
        setImages((e.target.files[0]));
        setPreviewImage(URL.createObjectURL(e.target.files[0]))

    }




   

    useEffect(()=>{
   
     // will fetch the pre-defined categories from the redux store 
            if(username === ''){
                    navigate('/login')
            }else{
                // check if the redux store categories has already been defined. if not fetch it and dispatch it to the redux store.
                if(allCategories.length === 0){
                    axios.get('/api/v1/categories.json').then(res=>
                        {   
                            setAllCats(res.data.data.map((item)=>{
                                return {
                                        id: item.id, name: item.attributes.name
                                       }
                            }))
                            dispatch(setAllCategories(res.data.data))
                        }).catch(res=>console.log(res))
                }else{
                    
                let temp = allCategories
                temp = temp.map((item,index) => {
                return {
                    id: item.id, name: item.attributes.name
                }
                })
                setAllCats(temp)
                }   
               
                
          
            
            }
           
     
        


 
   
    },[])

  

    // callback action for when submitting the post

    const handleSubmit = (e) => {

        // let post = {
        //     title: title,
        //     description: description,
        //     image_url: images,
        //     category_id: categoryIDChoose,
        //     category_name: categoryChoose,
        //     username: username
        // }

        const data = new FormData()

        data.append('post[title]', title)
        data.append('post[description]', description)
        data.append('post[image]', images)
        data.append('post[category_id]', categoryIDChoose)
        data.append('post[category_name]', categoryChoose)
        data.append('post[username]', username)
      

        fetch('http://localhost:3000/api/v1/posts',{
            method: 'POST',
            body: data
        }).then(res=>{
            if(res.ok){
                navigate('/')
            }else{
                setError('Please check that all fields have been filled in')
            }
           
        }).catch(res=>{
            setError('Please check that all fields have been filled in')
        })
    }


   
   
    
   



  return (
    <Container phone={phone}>
        
        <FormWrapper >
            <span style={{fontSize:'1.5rem',paddingBottom:5, fontWeight:600,borderBottom:'3px solid #ff7f50',fontFamily:'Poppins',
                color: 'black',alignSelf:'flex-start'
                 }}
                
                
                >Create A Post</span>
            <form style={{width:'100%'}} onSubmit={handleSubmit}>
                <InputField>
                    <input type='text'  name='title' placeholder='Title' value={title}  onChange={e=>(setTitle(e.target.value))} />
                </InputField>
                <InputField>
                    <textarea rows='7' cols='42' placeholder='Description' name='description'  value={description} onChange={e=>(setDescription(e.target.value))}  />
                </InputField>
                
                <Dropdown 
                 allCategories={allCats}
                 categoryChoose={categoryChoose}
                 setCategoryChoose={setCategoryChoose}
                 categoryIDChoose={categoryIDChoose}
                 setCategoryIDChoose={setCategoryIDChoose}
                  phone={phone}
                 />
              
                <InputField>
                    <input type='file' name='images'  onChange={(e)=>handleImageChange(e)} />
                </InputField>
                 {
                  previewImage 
                  &&
                  <div style={{alignSelf:'flex-start'}} >
                  <img style={{width:110,height:110,objectFit:'cover'}} src={previewImage} alt="" />
                  </div>
             
                }

                <SubmitButton onClick={(e)=>handleSubmit(e)}>
                Upload Post
                </SubmitButton>  
                {error !== '' &&  
                <span style={{color:'red', fontSize:'0.9rem',fontWeight:600,color:'red'}}>
                    {error}
                </span>}
            </form>
           
        </FormWrapper>
    </Container>
  )
}

export default CreatePost