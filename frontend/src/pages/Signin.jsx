import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Header"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import { useNavigate } from "react-router-dom"
import api from "../lib/axios"

export const Signin = () => {

    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSignin(){
      setLoading(true);
      try{
        const response = await api.post('/user/signin',{
          username,
          password
        });
        localStorage.setItem('token',response.data.token);
        alert('Signed in Successfully!');
        navigate('/');
      }catch(err){
        alert(err.response?.data?.message || 'Error signing in');
      } finally{
        setLoading(false);
      }
    }

    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-100 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox 
          placeholder="xyz@gmail.com" 
          label={"Email"} 
          onChange={(e)=>{setUsername(e.target.value)}}
        />

        <InputBox 
          placeholder="123456" 
          type = "password"
          label={"Password"} 
          onChange={(e)=>{setPassword(e.target.value)}}
        />
        
        <div className="pt-4">
          <Button 
            label={loading ? "Signing in..." : "Sign in"} 
            onClick={handleSignin}
          />
        </div>

        <BottomWarning 
          label={"Don't have an account?"} 
          buttonText={"Sign up"} 
          to={"/signup"} 
        />
      
      </div>
    </div>
  </div>
}