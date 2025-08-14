export function Balance({value}){
    return <div className="flex">
        <div className="font-bold text-lg">
            Balance
        </div>
        <div className="font-semibold ml-4 text-lg">
            Rs {value}
        </div>
    </div>
}