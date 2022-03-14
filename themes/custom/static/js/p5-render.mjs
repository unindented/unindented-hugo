import "./p5-v1.4.1/p5.min.js";

document.querySelectorAll('script[type="text/p5"]').forEach((script) => {
  const newScript = document.createElement("script");
  newScript.setAttribute("type", "module");
  newScript.setAttribute("src", script.getAttribute("src"));
  script.after(newScript);
  script.remove();
});
