/*
{{- $serviceWorker := resources.Get "js/service-worker.js" | resources.ExecuteAsTemplate "service-worker.js" . -}}
*/

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("{{ $serviceWorker.RelPermalink }}", { scope: "/" });
}

window.addEventListener("load", () => {
  if (navigator.serviceWorker.controller != null) {
    navigator.serviceWorker.controller.postMessage({ command: "trimCaches" });
  }
});
