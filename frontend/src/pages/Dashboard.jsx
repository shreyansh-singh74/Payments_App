import { useEffect, useState } from "react"
import { AppBar } from "../components/AppBar"
import { Balance } from "../components/Balance"
import { Users } from "../components/User"
import { useNavigate } from "react-router-dom"
import api from "../lib/axios"

export const Dashboard = () => {

    const [balance,setBalance] = useState(0);
    const [users,setUsers] = useState([]);
    const [filter,setFilter] = useState("");
    const navigate = useNavigate();

    useEffect(()=>{
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if(!token){
            navigate('/signin');
            return;
        }
        // Fetch Balance
        fetchBalance();
        
        // Fetch Users
        fetchUsers();
    },[navigate]);

    async function fetchBalance(){
        try{
            const response = await api.get('/account/balance');
            setBalance(response.data.balance?.balance || 0);
        }catch(err){
            console.log('Error Fetching balance: ',err);
            if(err.response?.status == 401){
                localStorage.removeItem('token');
                navigate('/signin');
            }
        }
    }

    const fetchUsers = async () => {
        try {

            const response = await api.get(`/user/bulk?filter=${filter}`);

            setUsers(response.data.users || []);
        } catch (error) {
            console.error('Error fetching users: ', error);

            setUsers([]); // Set empty array on error
        }
    };

    useEffect(()=>{
        fetchUsers();
    },[filter]);

    const handleLogout = ()=>{
        localStorage.removeItem('token');
        navigate('/signin');
    };

    return <div>
        <AppBar onLogout={handleLogout} />
        <div className="m-8">
            <Balance value={balance} />

            <Users
                users={users} 
                onFilterChange = {setFilter}
                filter={filter}
            />
        
        </div>
    </div>
}