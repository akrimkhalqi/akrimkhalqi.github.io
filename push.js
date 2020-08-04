const webPush = require('web-push');
const vapidKeys = {
    "publicKey": "BA0ZRSBiZAXO1fGiEvdGT64EQroONOeinqiEYXsjt3R7WwpXvgjlob78FYiy4ZPtdZ9zQl5vUw5wPIOgsWYqMpU",
    "privateKey": "eAEXi-rdEmMg5MK84sEDC0pqsUlu5mE-hkNWAvLKx5Q"
};


webPush.setVapidDetails(
    'mailto:akrimkhalqi11@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
const pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/ekt__2LL8vA:APA91bGIbY_OxObYc10xkSgIaO1iqCkr240w1It7TrlMtxubNuvHqSkTbSTsLUFG605z3_VgulN-UvZjddusjJxa1Cz7yRUQ_fG3g43xn5OPu5OVytlyOduGivddB2AupsGtHpxFTp9e",
    "keys": {
        "p256dh": "BGCqmZTeRKE6plruP1XhOOsG5TsKwsy7hHZcmkIOdUL+AcXPKcCLw/sT7/ZCxie3iHxWEYOlc66xepGw+DeCgYI=",
        "auth": "Yl4TENrk+nYh7ngjmBFb/Q=="
    }
};
const payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
const options = {
    gcmAPIKey: '172216904296',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);