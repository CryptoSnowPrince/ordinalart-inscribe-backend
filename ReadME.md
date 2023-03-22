# ordinalart-inscribe-backend

## API_URL

```text
https://inscribe.ordinal.art/api
```

## API_LIST

```text
POST
https://inscribe.ordinal.art/api/users/getUserInfo
uuid: string

POST
https://inscribe.ordinal.art/api/users/setUserInfo
uuid: string
name: string
avatar: number
background: number
actionDate: date

POST
https://inscribe.ordinal.art/api/users/getUserInscriptions
btcAccount: string

GET
https://inscribe.ordinal.art/api/users/getNotify?uuid=uuid

POST
https://inscribe.ordinal.art/api/users/removeNotify
uuid: uuid
removeAll: bool
type: Number
link: string
content: string
notifyDate: Date
```
