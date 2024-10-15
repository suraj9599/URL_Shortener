import { useState } from "react"
import axios from "axios";
function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [myQr, setMyQR] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(originalUrl);
    axios.post("http://localhost:5000/api/short", {originalUrl})
    .then((res)=>{
      console.log("API Response", res.data.myUrl)
      console.log(res.data.myQR)
      setShortUrl(res.data);
    })
  }

  
  return (
    <div className="bg-slate-100 w-full h-screen flex justify-center items-center">
      <div className="bg-slate-400 h-[400px] w-[600px] rounded flex items-center flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold text-center">FREE URL SHORTENER</h1>
        <form onSubmit={handleSubmit} className="w-full">
        <input type="url" placeholder="Enter Your URL" value={originalUrl} onChange={(e)=> setOriginalUrl(e.target.value)} className="border w-full p-2 mb-2 rounded"/>
        <button className="bg-[#2281C2] w-full rounded p-2">Shorten</button>
        </form>
        {shortUrl && 
        <>
        <p className="font-semibold">Shortened URL:</p>
        <p className="hover:text-purple-700"><a href={shortUrl.myUrl} >{shortUrl.myUrl}</a></p>
        <img src={shortUrl.myQR} />
        </>
        }
      </div>
    </div>
  )
}

export default App
