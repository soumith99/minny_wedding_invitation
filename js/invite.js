/**
 * Reads ?version= and ?key= before paint; sets <html data-invite-*> for CSS.
 */
(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const version = params.get("version") === "bride" ? "bride" : "groom";
  const key = params.get("key");
  const fullKey = window.INVITE_CONFIG?.fullAccessKey ?? "";
  const tier = key && key === fullKey ? "full" : "minimal";

  const root = document.documentElement;
  root.dataset.inviteTier = tier;
  root.dataset.inviteVersion = version;

  if (version === "bride") {
    document.title = "Malathi & Soumith | Wedding Invitation";
  }
})();
