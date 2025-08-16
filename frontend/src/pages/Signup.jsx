import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Header";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useNavigate } from "react-router-dom";
import api from '../lib/axios'

export function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSignup(){
    setLoading(true);
    try{
        const response = await api.post('user/signup',{
            username,
            password,
            firstName,
            lastName
        });

        localStorage.setItem('token',response.data.token);
        alert('Account Created Successfully!');
        navigate('/');
    }catch(err){
        alert(error.response?.data?.message || 'Error Creating the account');
    }
    finally{
        setLoading(false);
    }
  }

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-100 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your information to create an account"} />
          <InputBox 
            placeholder="First Name" 
            label="First Name"
            onChange = {(e)=>{setFirstName(e.target.value)}} 
          />
          <InputBox 
            placeholder="Last Name" 
            label="Last Name" 
            onChange = {(e)=>{setLastName(e.target.value)}}
          />
          <InputBox 
            placeholder="Email" 
            label="Email" 
            onChange = {(e)=>{setUsername(e.target.value)}}
          />
          <InputBox 
            placeholder="Password" 
            label="Password" 
            onChange = {(e)=>{setPassword(e.target.value)}}
          />

          <div className="pt-4">
            <Button 
                label={loading ? "Creating":"Sign up"} 
                onClick={handleSignup}
            />
          </div>

          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />

        </div>
      </div>
    </div>
  );
}
