import { useState } from "react";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

export function Users({ users = [], onFilterChange, filter }) {
    return (
        <div>
            <div className="font-bold mt-6 text-lg">
                Users
            </div>
            <div className="my-2">
                <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="w-full px-2 py-1 border rounded border-slate-200"
                    value={filter || ""}
                    onChange={(e) => onFilterChange && onFilterChange(e.target.value)}
                />
            </div>
            <div>
                {users.map(user => <User key={user._id} user={user} />)}
            </div>
        </div>
    );
}

function User({ user }) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between">
            <div className="flex">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user.firstName[0]}
                    </div>
                </div>
                <div className="flex flex-col justify-center h-full">
                    <div>
                        {user.firstName} {user.lastName}
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center h-full">
                <Button 
                    onClick={() => {
                        navigate("/sendmoney?id=" + user._id + "&name=" + user.firstName);
                    }} 
                    label={"Send Money"} 
                />
            </div>
        </div>
    );
}