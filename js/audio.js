/**
 * Ambient audio — runs as soon as <audio> is parsed (robinwedding.lovable.app).
 * Must load synchronously right after the audio element, not deferred.
 */
(function () {
  "use strict";

  var audio = document.getElementById("ambientAudio");
  if (!audio) return;

  var AUDIO_START_SEC = 16;

  audio.addEventListener("playing", function () {
    if (!Number.isFinite(audio.duration) || audio.duration <= AUDIO_START_SEC) return;
    if (audio.currentTime < AUDIO_START_SEC) audio.currentTime = AUDIO_START_SEC;
  });

  function setPlaying(playing) {
    audio.dispatchEvent(new CustomEvent("ambient-audio-state", { detail: { playing: playing } }));
  }

  function tryPlay() {
    return audio.play().then(function () {
      setPlaying(true);
    });
  }

  function registerUnlock() {
    function unlock() {
      tryPlay().catch(function () {});
      document.removeEventListener("click", unlock);
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("scroll", unlock);
    }

    document.addEventListener("click", unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true });
    document.addEventListener("scroll", unlock, { once: true });
  }

  tryPlay().catch(registerUnlock);
})();
