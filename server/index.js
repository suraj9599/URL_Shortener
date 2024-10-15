import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import QRCode from "qrcode";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
    .then(()=> console.log("DB connected successfully"))
    .catch((err)=> console.log("Failed to connect database",err))


const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String,
    clicks:{
        type: Number,
        default: 0,
    },
})
const Url = mongoose.model("Url",urlSchema);

app.post("/api/short", async (req,res)=> {
    try{
        const {originalUrl} = req.body;
        if(!originalUrl) return res.status(500).json({error: "Original Url Required!"});
        const shortUrl = nanoid(8);
        const url = new Url({originalUrl, shortUrl});
        const myUrl = `http://localhost:5000/${shortUrl}`;
        const myQR = await QRCode.toDataURL(myUrl)
        await url.save();
        return res.status(200).json({msg: "Url Generated", myUrl, myQR});
    }catch(error){
        console.log(error);
        res.status(500).json({error: "Server Error"});
    }
})

app.get("/:shortUrl", async (req, res)=>{
    try{
        const { shortUrl } = req.params;
        const url = await Url.findOne({shortUrl});
        if(url){
            url.clicks++;
            await url.save();
            return res.redirect(url.originalUrl);
        }else{
            return res.status(404).json({error: "URL Not Found"});
        }
    }catch(error){
        console.log(error);
        res.status(500).json({error: "Server Error"});
    }
})
app.listen(5000, ()=> console.log("Server is running on PORT 5000"));