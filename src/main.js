const selector = document.querySelector("#selector");
const content = document.querySelector("#content");
if (!content || !selector) {
  throw new Error("Elements not found");
}

const converter = new showdown.Converter();

const README_URL =
  "https://raw.githubusercontent.com/codecrafters-io/build-your-own-x/master/README.md";

const allLanguages = new Map();
const selectedLanguages = new Set();

const LANGUAGE_COLOR = {
  "C++": "#f34b7d",
  "C#": "#178600",
  Go: "#00ADD8",
  Java: "#b07219",
  JavaScript: "#f1e05a",
  "Node.js": "#026e00",
  Python: "#3572A5",
  Rust: "#dea584",
  TypeScript: "#2b7489",
  Ruby: "#701516",
  Swift: "#ffac45",
  Kotlin: "#F18E33",
  Scala: "#c22d40",
  Shell: "#89e051",
  PHP: "#4F5D95",
  Perl: "#0298c3",
  Dart: "#00B4AB",
  Haskell: "#5e5086",
  "Objective-C": "#438eff",
  Lua: "#000080",
  Assembly: "#6E4C13",
  Clojure: "#db5855",
  "Vim script": "#199f4b",
  Elixir: "#6e4a7e",
  R: "#198CE7",
  Alloy: "#64C800",
  Nim: "#37775b",
  CSS: "#563d7c",
};

const displayAll = () => {
  const listItems = document.querySelectorAll("li");
  for (const listItem of listItems) {
    const languagesElement = listItem.querySelector("strong");
    if (!languagesElement) {
      continue;
    }

    const languagesText = languagesElement?.textContent || "";
    const languages = languagesText
      .split("/")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (!languages || languages.length === 0) {
      continue;
    }

    if (languages.some((l) => selectedLanguages.has(l))) {
      listItem.style.display = "list-item";
    } else {
      listItem.style.display = "none";
    }

    const color = LANGUAGE_COLOR[languages[0]]
      ? LANGUAGE_COLOR[languages[0]] + "18"
      : "#f4f4f4";

    listItem.style.backgroundColor = color;
  }
};

const onLanguageChange = (event) => {
  const language = event.target.value;
  if (event.target.checked) {
    selectedLanguages.add(language);
  } else {
    selectedLanguages.delete(language);
  }

  displayAll();
};

const main = async () => {
  const response = await fetch(README_URL);
  const text = await response.text();

  content.innerHTML = converter.makeHtml(text);

  const links = content.querySelectorAll("a");
  for (const link of links) {
    const index = link.href.indexOf("#build");
    if (index !== -1) {
      const firstPart = link.href.substring(0, index);
      const secondPart = link.href.substring(index);
      link.href = firstPart + secondPart.replaceAll("-", "");
    }
  }

  const listItems = document.querySelectorAll("li");
  for (const listItem of listItems) {
    const languagesElement = listItem.querySelector("strong");
    if (!languagesElement) {
      continue;
    }

    const languagesText = languagesElement?.textContent || "";
    const languages = languagesText
      .split("/")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    for (const language of languages) {
      if (!allLanguages.has(language)) {
        allLanguages.set(language, 0);
      }
      allLanguages.set(language, allLanguages.get(language) + 1);
    }
    selectedLanguages.add(...languages);
  }

  displayAll();

  const select = document.createElement("details");
  select.style = "margin: auto";
  select.innerHTML = `
    <summary>Select language</summary>
    <ul>
      ${Array.from(allLanguages)
        .sort((a, b) => b[1] - a[1])
        .map(
          ([l, count]) =>
            `<label><input type="checkbox" value="${l}" onchange="onLanguageChange(event)" ${
              selectedLanguages.has(l) ? "checked" : ""
            } />${l} (${count})</label>`
        )
        .join("")}
    </ul>
  `;

  selector.appendChild(select);
  selector.style = "display: flex";
};

main();
