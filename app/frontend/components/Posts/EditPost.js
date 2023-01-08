import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Dropdown from "./Dropdown/Dropdown";
// shall use the react-select library for the users to select a category to tag to their post
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ReactLoading from "react-loading";

const Container = styled.div`
  width: 100vw;
  background: #fff2e5;
  height: 110vh;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormWrapper = styled.div`
  width: 80%;
  background-color: #fff;

  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 5px;
  padding: 30px 20px;
  gap: 10px;
`;

const InputField = styled.div`
  width: 90%;

  border-radius: 5px;
  z-index: 10;

  input {
    width: 100%;
    font-size:16px
    min-height: 30px;
    border-radius: 4px;
    border: 1px solid #e6e6e6;
    margin: 12px 0;
    padding: 15px;
    font-family: Poppins;
  }

  textarea {
    width: 100%;
    min-height: 80px;
    border-radius: 4px;
    border: 1px solid #e6e6e6;
    margin: 12px 0;
    padding: 15px;
    font-family: Poppins;
  }
`;

const SubmitButton = styled.div`
  padding: 15px;
  width: 90%;
  margin-top: 10px;
  border: 1px solid transparent;
  background-color: #ff7f50;
  color: white;
  border-radius: 5px;
  font-weight: 500;
  font-family: Poppins;
  font-size: 1.1rem;
  text-align: center;
  cursor: pointer;
`;

const EditPost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { post_id, slug } = useParams();
  const { username, allCategories } = useSelector((state) => state.userReducer);

  // state to handle title of post

  const [title, setTitle] = useState("");

  // state to handle description of post

  const [description, setDescription] = useState("");

  // state to handle image to be previewed and uploaded
  const [images, setImages] = useState("");
  const [previewImage, setPreviewImage] = useState();

  // state to handle category choose (must be in id form)

  const [categoryChoose, setCategoryChoose] = useState();
  const [categoryIDChoose, setCategoryIDChoose] = useState();
  const [allCats, setAllCats] = useState([]);
  // state to manage errors in the form

  const [error, setError] = useState("");

  // state to handle waiting for post to be edited

  const [editing,setEditing] = useState(false)

  // regex expression here is to check if the file is a valid image type
  const imageValidationRegex = /image\/(png|jpg|jpeg)/gm;

  const handleImageChange = (e) => {
    setImages(e.target.files[0]);
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
  };

  useEffect(() => {
    if (username === "") {
      navigate("/login");
    } else {
      // will fetch the pre-defined categories from the redux store

      let temp = allCategories;

      temp = temp.map((item, index) => {
        return {
          id: item.id,
          name: item.attributes.name,
        };
      });

      setAllCats(temp);

      // get original post data and set the states accordingly

      axios.get(`/api/v1/posts/${post_id}/${slug}`).then((res) => {
        setTitle(res.data.data.attributes.title);
        setDescription(res.data.data.attributes.description);
        setPreviewImage(res.data.data.attributes.image_url);
        setCategoryChoose(res.data.data.attributes.category_name);
        setCategoryIDChoose(res.data.data.attributes.category_id);
      });
    }
  }, []);

  // callback action for when submitting the post

  const handleSubmit = () => {
    //  let post = {
    //     title: title,
    //     description: description,
    //     image: images === '' ? previewImage : images,
    //     category_id: categoryIDChoose,
    //     category_name: categoryChoose,
    //     username: username
    // }

    const data = new FormData();
    data.append("post[title]", title);
    data.append("post[description]", description);
    if(images !== ''){
       data.append("post[image]", images);
    }
   
    data.append("post[category_id]", categoryIDChoose);
    data.append("post[category_name]", categoryChoose);
    data.append("post[username]", username);

 

    fetch(`/api/v1/posts/${post_id}`, {
      method: "PATCH",
      body: data,
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          navigate(`post/${post_id}/${slug}`);
        } else {
          throw new Error("Network error");
        }
      })
      .catch((res) => console.log(res));

    // axios.post('/api/v1/posts',post,{withCredentials:true})
    // .then(res=>{
    //         if(res.status === 200){
    //             navigate('/')

    //         }else{
    //             setError(res.data.errors)
    //         }
    // })
  };

  return (
    <Container>
      <FormWrapper>
        <span
          style={{
            fontSize: "1.5rem",
            paddingBottom: 5,
            fontWeight: 600,
            borderBottom: "3px solid #ff7f50",
            fontFamily: "Poppins",
            color: "black",
            alignSelf: "flex-start",
          }}
        >
          Edit Your Post
        </span>
        <form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <InputField>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </InputField>
          <InputField>
            <textarea
              rows="7"
              cols="42"
              placeholder="Description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </InputField>

          <Dropdown
            allCategories={allCats}
            categoryChoose={categoryChoose}
            setCategoryChoose={setCategoryChoose}
            categoryIDChoose={categoryIDChoose}
            setCategoryIDChoose={setCategoryIDChoose}
          />

          <InputField>
            <input
              type="file"
              name="images"
              onChange={(e) => handleImageChange(e)}
            />
          </InputField>
          {previewImage && (
            <div style={{ alignSelf: "flex-start" }}>
              <img
                style={{ width: 110, height: 110, objectFit: "cover" }}
                src={previewImage}
                alt=""
              />
            </div>
          )}

          <SubmitButton onClick={(e) => handleSubmit(e)}>
            Edit Post
          </SubmitButton>
          {error !== "" && (
            <span
              style={{
                color: "red",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "red",
              }}
            >
              {errorMessage}
            </span>
          )}
        </form>
      </FormWrapper>
    </Container>
  );
};

export default EditPost;
