const express = require('express')
const app = express()
const port = 3000
require('dotenv').config();

app.use(express.json());

const url = process.env.GATEWAY_HOST; 
const key = process.env.ADMIN_API_KEY_ID;
const secret = process.env.ADMIN_API_KEY_SECRET;

app.post('/getAPIKey', async (req, res) => {
  const { username, firstname, lastname, email } = req.body; 
  
  const addUserRes = await fetch(`${url}/admin/users`, 
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `apikey ${key}:${secret}`
        },
        body: JSON.stringify({
            username,
            firstname,
            lastname, 
            email
        })
    }
  )

  if (!addUserRes.ok) {
    return res.status(500).json({message: `failed to register user to gateway control plane`});
  }

  const { id } = await addUserRes.json(); 

  const createCredentialRes = await fetch(`${url}/admin/credentials`, 
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `apikey ${key}:${secret}`
        },
        body: JSON.stringify({
            consumerId: id, 
            type: "key-auth"
        })
    });

  if (!createCredentialRes.ok) {
    return res.status(500).json({message: "failed to create credential from gateway control plane"});
  }

  const { keyId, keySecret } = await createCredentialRes.json(); 

  return res.json({keyId, keySecret});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})