/*
{{- $serviceWorker := resources.Get "js/service-worker.js" | resources.ExecuteAsTemplate "service-worker.js" . -}}
*/

(() => {
  const colorSchemeButton = document.querySelector("#color-scheme");
  const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');

  colorSchemeButton.addEventListener("click", () => {
    const { classList } = document.documentElement;
    const colorScheme = classList.toggle("dark") ? "dark" : "light";
    colorSchemeMeta.setAttribute("content", colorScheme);
    localStorage.setItem("color-scheme", colorScheme);
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("{{ $serviceWorker.RelPermalink }}", { scope: "/" });

    window.addEventListener("load", () => {
      navigator.serviceWorker.controller?.postMessage({ command: "trimCaches" });
    });
  }
})();
