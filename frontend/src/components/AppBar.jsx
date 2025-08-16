export function AppBar({onLogout}){
    return <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full ml-4">
            PayTM App
        </div>

        <div className="flex">
            <div className="flex flex-col justify-center h-full mr-4">
                Hello
            </div>
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    U
                </div>
            </div>
            <button 
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-2 rounded mr-4 mt-1 h-10"
            >
                Logout
            </button>
        </div>
    </div>
}

// Add default export as well
export default AppBar;