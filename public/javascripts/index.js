function getFormData(object) {
    const formData = new FormData();
    Object.keys(object).forEach(key => formData.append(key, object[key]));
    return formData;
}

const recordAudio = () =>
    new Promise(async resolve => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", event => {
            audioChunks.push(event.data);
        });

        const start = () => mediaRecorder.start();

        const stop = () =>
            new Promise(resolve => {
                mediaRecorder.addEventListener("stop", () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg-3' });
                    const audioUrl = URL.createObjectURL(audioBlob);

                    var data = new FormData();
                    data.append('file', audioBlob);
                    data.append('api_token', 'bd98d9fc3a624550e39e4d73f5b804f6')
                    $.ajax({
                        url: "https://api.audd.io/",
                        type: 'POST',

                        data: data,
                        contentType: false,
                        processData: false,
                        success: function (data) {

                            fetch('/audio', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(data),
                            })
                            .then(x => x.json())
                            .then(function(data) {
                                if (data)
                                    window.location.replace("/?id=" + data.id + "&title=" + data.title + "&artist=" + data.artist.name);
                                else 
                                    window.location.replace("/");
                            })
                            .catch(err => console.log(err))

                        }
                    });
                    const audio = new Audio(audioUrl);
                    const play = () => audio.play();
                    resolve({ audioBlob, audioUrl, play });
                });

                mediaRecorder.stop();
            });

        resolve({ start, stop });
    });

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const handleAction = async () => {
    const recorder = await recordAudio();
    const actionButton = document.getElementById('action');
    actionButton.disabled = true;
    recorder.start();
    await sleep(10000);
    const audio = await recorder.stop();
    actionButton.disabled = false;
}