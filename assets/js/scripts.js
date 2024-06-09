// Color scheme

(() => {
  const colorSchemeButton = document.querySelector("#color-scheme-button");
  const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');

  colorSchemeButton.addEventListener("click", () => {
    const { classList: colorSchemeClass } = document.documentElement;
    const colorScheme = colorSchemeClass.toggle("dark") ? "dark" : "light";
    colorSchemeMeta.setAttribute("content", colorScheme);
    localStorage.setItem("color-scheme", colorScheme);
  });
})();

// Search dialog

(() => {
  let search = null;

  const searchButton = document.querySelector("#search-button");
  const searchDialog = document.querySelector("#search-dialog");
  const searchDialogInput = document.querySelector("#search-dialog-input");
  const searchDialogConfirmButton = document.querySelector("#search-dialog-confirm-button");
  const searchDialogResults = document.querySelector("#search-dialog-results");

  searchButton.addEventListener("click", async () => {
    searchDialog.showModal();

    if (search != null) {
      return;
    }

    const [{ default: Search }, searchIndex] = await Promise.all([
      import("/js/search.mjs"),
      fetch("/search.json").then((response) => response.json()),
    ]);

    search = new Search({
      index: searchIndex,
      dialog: searchDialog,
      dialogInput: searchDialogInput,
      dialogConfirmButton: searchDialogConfirmButton,
      dialogResults: searchDialogResults,
    });

    search.execute();
  });
})();

// Hotkeys

(() => {
  const hotkeys = [...document.querySelectorAll("[data-hotkey]")].reduce(
    (acc, element) =>
      element.dataset.hotkey.split(",").reduce((acc, key) => {
        acc[key] = element;
        return acc;
      }, acc),
    {}
  );

  const isFormField = (element) => {
    const name = element.nodeName.toLowerCase();
    const type = (element.getAttribute("type") || "").toLowerCase();

    return (
      element.isContentEditable ||
      (name === "input" &&
        type !== "checkbox" &&
        type !== "file" &&
        type !== "radio" &&
        type !== "reset" &&
        type !== "submit") ||
      name === "select" ||
      name === "textarea"
    );
  };

  document.addEventListener("keydown", (event) => {
    const { defaultPrevented, key, altKey, ctrlKey, metaKey, target } = event;

    if (defaultPrevented || altKey || ctrlKey || metaKey || isFormField(target)) {
      return;
    }

    const element = hotkeys[key];
    if (element != null) {
      element[isFormField(element) ? "focus" : "click"]();
      event.preventDefault();
    }
  });
})();

// Service Worker

/*
{{ $serviceWorker := resources.Get "js/service-worker.js" | resources.ExecuteAsTemplate "service-worker.js" . }}
*/

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("{{ $serviceWorker.RelPermalink }}", {
    scope: '{{ "" | relURL }}',
  });

  window.addEventListener("load", () => {
    navigator.serviceWorker.controller?.postMessage({ command: "trimCaches" });
  });
}
