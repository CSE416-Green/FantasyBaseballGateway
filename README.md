
Fantasy Baseball Gateway 

### Endpoints
1. Route request to fantasy baseball api 
```bash
 curl https://fantasybaseballgateway.onrender.com/api/stats/2025

  -H "Authorization: apikey keyId:keySecret" 
```

2. Route request to gateway's control plane, which has endpoints for Identity & Access Management (IAM)
```bash
curl https://fantasybaseballgateway.onrender.com/admin/apps -H "Authorization:apikey adminKeyId:adminkeySecretId"
```

### Local development 
```bash
npm run start 
```
The gateway is listening on http://localhost:8080
