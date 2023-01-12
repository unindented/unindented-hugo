import Fuse from "./fuse-v6.6.2/fuse.min.js";

const fuseOptions = {
  includeMatches: true,
  includeScore: true,
  shouldSort: true,
  useExtendedSearch: true,
  keys: [
    { name: "title", weight: 0.8 },
    { name: "content", weight: 0.7 },
    { name: "categories", weight: 0.2 },
    { name: "tags", weight: 0.2 },
  ],
};

const highlightText = (str, ranges) => {
  const sortedRanges = [...ranges].sort(([aStart], [bStart]) => aStart - bStart);

  const combinedRanges = sortedRanges.reduce((acc, next) => {
    if (acc.length === 0 || acc[acc.length - 1][1] < next[0]) {
      acc.push(next);
    } else {
      const prev = acc.pop();
      acc.push([prev[0], Math.max(prev[1], next[1])]);
    }
    return acc;
  }, []);

  const { acc: highlightedRanges } = combinedRanges.reduce(
    ({ acc, lastIndex }, [rangeStart, rangeEnd], rangeIndex) => {
      const nextIndex = rangeEnd + 1;
      acc.push(str.substring(lastIndex, rangeStart), "<u>", str.substring(rangeStart, nextIndex), "</u>");
      if (rangeIndex === combinedRanges.length - 1) {
        acc.push(str.substring(nextIndex));
      }
      return { acc, lastIndex: nextIndex };
    },
    { acc: [], lastIndex: 0 }
  );

  return highlightedRanges.join("");
};

export default class Search {
  constructor({ index, dialog, dialogInput, dialogConfirmButton, dialogResults }) {
    this.fuse = new Fuse(index, fuseOptions);

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
    const html = results.length > 0 ? this.renderSearchResults(results) : "";
    this.dialogResults.innerHTML = html;
  }

  renderSearchResults(results) {
    return `
  <h2 class="sr-only">Search results</h2>
  ${results.map((result) => this.renderSearchResult(result)).join("\n")}
  `;
  }

  renderSearchResult(result) {
    const highlightedResult = this.highlightSearchResult(result);
    const { title, content, permalink } = highlightedResult;

    return `
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
  }

  highlightSearchResult({ item, matches }) {
    return matches.reduce((acc, match) => this.updateResult(acc, match), structuredClone(item));
  }

  updateResult(result, { key, value, indices, refIndex }) {
    const path = key.split(".");
    const newValue = highlightText(value, indices);

    for (let i = 0, l = path.length, obj = result; i < l; i++) {
      const p = path[i];
      if (i < l - 1) {
        obj = obj[p];
      } else if (refIndex == null) {
        obj[p] = newValue;
      } else {
        obj[p][refIndex] = newValue;
      }
    }

    return result;
  }
}
