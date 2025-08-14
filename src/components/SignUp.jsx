  import axios from "axios";
  import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "./context/user-context";

  const SignUp = ({setIsLoggedIn}) => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
    });
    // const [token,setToken]=useState("")
    const {updateUser}=useContext(UserContext)
    const [login,setLogin]=useState(false)
    const navigate=useNavigate()
    const handleChange = (e) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
    console.log(formData);
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          let url;
          if(login){
              url='http://localhost:3000/login'
          }
          else{
              url='http://localhost:3000/signup'
          }
        const res = await axios.post(url, {
          name: !login?formData.name:undefined,
          email: formData.email,
          password: formData.password,
        });
        setFormData({ name: "", email: "", password: "" });
        localStorage.setItem("token",res.data.token);
        updateUser(res.data.newUser)
        // localStorage.setItem('user', JSON.stringify(res.data.newUser));
        setIsLoggedIn(true)
        alert(res.data.message);
        console.log("Response:", res.data);
        navigate('/expenseForm')
      } catch (err) {
        const message =
        err.response?.data?.message || // backend's message
        err.message ||                 // axios/network message
        "Something went wrong";        // fallback
      alert(message);
      }
    };
    return (
      <>
        <form onSubmit={handleSubmit}>
          {!login && <><label htmlFor="name">Name:</label>
          <input
            required
            name="name"
            value={formData.name}
            id="name"
            type="text"
            placeholder="name"
            onChange={handleChange}
          /></>}
          
          <label htmlFor="email">Email:</label>
          <input
            required
            value={formData.email}
            name="email"
            id="email"
            type="email"
            placeholder="email"
            onChange={handleChange}
          />
          <label htmlFor="password">Password:</label>
          <input
            required
            name="password"
            value={formData.password}
            id="password"
            type="password"
            placeholder="password"
            onChange={handleChange}
          />
          <button type="submit">{login?"LogIn":"SignUp"}</button>
        </form>
        {login && <Link to='/forgetpassword'><button>Forget Passwod?</button></Link>}
        <button onClick={()=>setLogin(!login)}>{login?"New here? Sign up now":"Already Signed up? Log in now"}</button>
      </>
    );
  };

  export default SignUp;
