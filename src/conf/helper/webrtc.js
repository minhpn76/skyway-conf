function toggleMuteVideoTracks(stream, isMuted) {
  stream.getVideoTracks().forEach(track => (track.enabled = !isMuted));
}
function toggleMuteAudioTracks(stream, isMuted) {
  stream.getAudioTracks().forEach(track => (track.enabled = !isMuted));
}

async function getUserDevices() {
  const userDevices = {
    video: [],
    audio: [],
  };

  const devices = await navigator.mediaDevices.enumerateDevices();
  for (const device of devices) {
    if (device.kind === 'videoinput') {
      userDevices.video.push(device);
    }
    if (device.kind === 'audioinput') {
      userDevices.audio.push(device);
    }
  }

  return userDevices;
}

function getUserMedia({ videoDeviceId, audioDeviceId }) {
  return navigator.mediaDevices.getUserMedia({
    video: { deviceId: videoDeviceId },
    audio: { deviceId: audioDeviceId },
  });
}

function snapVideoStream(stream, mimeType = 'image/webp', qualityArgument = 1) {
  let $video = document.createElement('video');
  $video.srcObject = stream;

  return new Promise(resolve => {
    // need to wait this to get first frame image
    $video.addEventListener(
      'loadeddata',
      () => {
        let $canvas = document.createElement('canvas');
        $canvas.width = $video.videoWidth;
        $canvas.height = $video.videoHeight;

        // copy same size
        const ctx = $canvas.getContext('2d');
        ctx.drawImage($video, 0, 0);

        // then compress
        $canvas.toBlob(
          blob => {
            $video.srcObject = null;
            $video = $canvas = null;

            resolve(blob);
          },
          mimeType,
          qualityArgument
        );
      },
      { once: true }
    );
  });
}

export default {
  toggleMuteVideoTracks,
  toggleMuteAudioTracks,
  getUserDevices,
  getUserMedia,
  snapVideoStream,
};
