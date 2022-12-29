require('dotenv').config()

const CLIENT_ID=process.env.CLIENT_ID
const CLIENT_SECRET=process.env.CLIENT_SECRET

const axios = require('axios')

const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())

app.use(cors())

// code is passed from frontend
app.get('/github/access-token',async(req,res) => {

  console.log("code received at backend :",req.query.code)

  const params = "?client_id="+ CLIENT_ID+"&client_secret="+ CLIENT_SECRET+"&code="+ req.query.code

  const response= await  axios.post('https://github.com/login/oauth/access_token'+params)
  
  const data = response.data

  console.log("The response data decoded at the backend is : " + data)
  
  const containsToken = data.startsWith("access_token=") &&
      data.endsWith("&scope=&token_type=bearer")

  if(!containsToken)res.status(404).json({access_token:null})
  
  const access_token = data.substring("access_token=".length,data.indexOf("&scope=&token_type=bearer"))
  
  console.log("access_token : " + access_token)
  
  res.json({
      access_token
    })
 
})

app.get('/github/user-data',async(req,res)=>{
  
  const config = {
    headers: { "Authorization": req.get("Authorization") },
  }

    
  const response =await axios.get("https://api.github.com/user" ,config)

  const data = response.data

  console.log("The response data decoded at the backend is : " + JSON.stringify(data,null,2))

  res.json(data)

})

const PORT=4000

app.listen(PORT,()=>{
  console.log("listening on port " + PORT)
})