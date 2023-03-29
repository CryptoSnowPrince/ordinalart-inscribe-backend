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
actionDate: date

return {result: {
        uuid: savedItem.uuid,
        btcAccount: savedItem.btcAccount,
        firstLoginDate: savedItem.firstLoginDate,
        lastUpdateDate: savedItem.lastUpdateDate,
        lastLoginDate: savedItem.lastLoginDate,
        balance: balance
    },
    status: SUCCESS,
    message: "Create Success"
};

POST
https://inscribe.ordinal.art/api/users/getUserInscriptions
uuid: string

return {
    result: inscriptionArray,
    status: SUCCESS,
    message: "Create Success"
};

GET
https://inscribe.ordinal.art/api/users/getNotify?uuid=uuid

return notificationArray

POST
https://inscribe.ordinal.art/api/users/removeNotify
uuid: uuid
removeAll: false(one)/true(multiple)
type: Number
link: string
content: string
notifyDate: Date
```
