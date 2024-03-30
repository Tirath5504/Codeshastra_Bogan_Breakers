const randBool = () => Math.random() >= 0.5;
const randNum = (min, max) => {
    const range = max - min + 1;
    return Math.floor(Math.random() * range) + min;
};
const pushSampleRecord = async (authToken) => {
    let start = 1710063493909;
    const n = 1711791493909;
    while (start < n) {
        const data = {
            "correctPosture": randBool(),
            "shakeTime": randNum(6, 15),
            "shakeOrientation": randBool(),
            "shakeCount": randNum(40, 60),
            "distance": randNum(6, 15),
            "clickActivation": randBool(),
            "inhaleAngle": randNum(80, 100),
            "inhaleTime": randNum(6, 15),
            "holdTime": randNum(6, 15),
            "time": (new Date(start)),
        }
        await fetch('http://127.0.0.1:5000/record/saveRecord', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authToken,
            },
            body: JSON.stringify(data),
        })
        start += 1000 * 60 * 60 * 10;
    }
}
const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZW1haWwuY29tIiwiaWF0IjoxNzExNzg0MTAzfQ.dpc3wMY3kMJjKmGCMv5WNt60Tmq0vK7XRDO8LzjyVvs"
pushSampleRecord(authToken);