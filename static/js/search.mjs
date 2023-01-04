import Fuse from "./fuse-v6.6.2/fuse.min.js";

const fuseOptions = {
  includeMatches: true,
  includeScore: true,
  shouldSort: true,
  keys: [
    { name: "title", weight: 0.8 },
    { name: "content", weight: 0.7 },
    { name: "categories", weight: 0.2 },
    { name: "tags", weight: 0.2 },
  ],
};

const searchResult = ({ title, content, permalink }) => `
<article class="border-b border-gray-200 py-2 last:border-b-0 dark:border-gray-700 sm:py-4">
  <h3>
    <a
      href="${permalink}"
      class="text-2xl font-bold text-gray-700 hover:text-blue-700 focus:text-blue-700 dark:text-gray-300 dark:hover:text-blue-300 dark:focus:text-blue-300"
      >${title}</a
    >
  </h3>
  <p class="mt-2 truncate text-base text-gray-600 dark:text-gray-400">${content}</p>
</article>
`;

const searchResults = (results) => `
<h2 class="sr-only">Search results</h2>
${results.map(({ item }) => searchResult(item)).join('\n')}
`;

export default class Search {
  constructor({ index, dialog, dialogInput, dialogConfirmButton, dialogResults }) {
    this.fuse = new Fuse(index, fuseOptions);

    this.index = index;
    this.dialog = dialog;
    this.dialogInput = dialogInput;
    this.dialogConfirmButton = dialogConfirmButton;
    this.dialogResults = dialogResults;

    this.dialog.addEventListener("click", (event) => {
      if (event.target.nodeName === "DIALOG") {
        this.dialog.close();
      }
    });

    this.dialogInput.addEventListener("input", () => {
      this.execute();
    });

    this.dialogConfirmButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.execute();
    });

    const dialogObserver = new MutationObserver(([record]) => {
      if (record.attributeName === "open" && this.dialog.open) {
        this.execute();
      }
    });
    dialogObserver.observe(this.dialog, { attributes: true });
  }

  async execute() {
    const { value } = this.dialogInput;
    const results = this.fuse.search(value);
    const html = results.length > 0 ? searchResults(results) : '';
    this.dialogResults.innerHTML = html;
  }
}
