import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../lib/axios'; // Use the configured axios instance

export const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Derive a safe initial for avatar and a safe display name
    const initial = name?.[0]?.toUpperCase() || "?";
    const displayName = name || "Unknown";

    const handleTransfer = async () => {
        const amt = Number(amount);
        if (!id || !name || !amt || amt <= 0) {
            alert("Missing recipient or invalid amount");
            return;
        }

        setLoading(true);
        try {
            await api.post("/account/transfer", {
                to: id, // Send the user ID
                amount: amt
            });
            alert("Transfer successful!");
            navigate('/');
        } catch (error) {
            alert(error?.response?.data?.message || "Transfer failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className="h-full flex flex-col justify-center">
                <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h2 className="text-3xl font-bold text-center">Send Money</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-2xl text-white">{initial}</span>
                            </div>
                            <h3 className="text-2xl font-semibold">{displayName}</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="amount"
                                >
                                    Amount (in Rs)
                                </label>
                                <input
                                    onChange={(e) => setAmount(e.target.value)}
                                    type="number"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    id="amount"
                                    placeholder="Enter amount"
                                    value={amount}
                                />
                            </div>
                            <button 
                                onClick={handleTransfer}
                                disabled={loading}
                                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                            >
                                {loading ? "Processing..." : "Initiate Transfer"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};