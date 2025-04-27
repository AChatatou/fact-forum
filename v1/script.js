const formBtn = document.querySelector("#show-form-btn");
const form = document.querySelector(".fact-form");
const factList = document.querySelector(".fact-list");

const categoriesList = document.querySelector(".categories");

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

formBtn.addEventListener("click", function () {
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    formBtn.textContent = "Close";
  } else {
    formBtn.textContent = "Share a fact";
    form.classList.add("hidden");
  }
});

function calcFactAge(year) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  return age >= 0
    ? age
    : `Invalid. Year needs to be less than or equal ${currentYear}`;
}

function setCategories() {
  categoriesList.innerHTML = "";
  const formSelect = form.querySelector("select");
  formSelect.innerHTML = `<option value="">Chose category</option>`;

  CATEGORIES.forEach((elem) => {
    const newItem = document.createElement("li");
    newItem.innerHTML = `<button class="btn btn-category" style="background-color:${elem.color}">${elem.name}</button>`;
    categoriesList.appendChild(newItem);

    const newOption = document.createElement("option");
    newOption.textContent =
      elem.name.charAt(0).toUpperCase() + elem.name.slice(1).toLowerCase();
    newOption.value = elem.name;

    formSelect.appendChild(newOption);
  });
}

function getCategoryColor(categoryName) {
  return (CATEGORIES.find((category) => category.name === categoryName) || {})
    .color;
}

// DOM First

function createFactsList(dataArray) {
  factList.innerHTML = "";
  dataArray.forEach((fact) => {
    const newFact = document.createElement("li");
    newFact.classList.add("fact");
    newFact.innerHTML = `
            <p>
                ${fact.text}
                <a class="source" href="${
                  fact.source
                }" target="_blank">(Source)</a>
            </p>
            <span class="tag" style="background-color:${getCategoryColor(
              fact.category
            )}" >${fact.category}</span>
            <ul class="reactions">
                <li>
                  <button>👍 ${fact.votesInteresting}</button>
                </li>
                <li>
                  <button>🤯 ${fact.votesMindblowing}</button>
                </li>
                <li>
                  <button>❌ ${fact.votesFalse}</button>
                </li>
            </ul>
    `;
    factList.appendChild(newFact);
  });
}

// HTML first (1 DOM Operation)

function createFactsList_2(dataArray) {
  factList.innerHTML = "";
  const htmlArr = dataArray.map(
    (fact) => `
    <li class="fact">
            <p>
                ${fact.text}
                <a class="source" href="${
                  fact.source
                }" target="_blank">(Source)</a>
            </p>
            <span class="tag" style="background-color:${getCategoryColor(
              fact.category
            )}" >${fact.category}</span>
            <ul class="reactions">
                <li>
                  <button>👍 ${fact.votesInteresting}</button>
                </li>
                <li>
                  <button>🤯 ${fact.votesMindblowing}</button>
                </li>
                <li>
                  <button>❌ ${fact.votesFalse}</button>
                </li>
            </ul>
    </li>
    `
  );

  const html = htmlArr.join("");
  factList.insertAdjacentHTML("afterbegin", html);
}

/*
When you need structure and control (event listeners...) — go createElement.
When you need speed and simplicity — go insertAdjacentHTML.
*/

// Fetch data

async function loadData() {
  const res = await fetch(
    "https://brfkzcmtohregfauqpji.supabase.co/rest/v1/facts",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyZmt6Y210b2hyZWdmYXVxcGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMTcxNDYsImV4cCI6MjA2MDg5MzE0Nn0.pgRLzFF61khkks75cH5WY3rvZEUw4rUTvgW7PJmbPmM",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyZmt6Y210b2hyZWdmYXVxcGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMTcxNDYsImV4cCI6MjA2MDg5MzE0Nn0.pgRLzFF61khkks75cH5WY3rvZEUw4rUTvgW7PJmbPmM",
      },
    }
  );
  const data = await res.json();
  console.log(data);
  //return data;
  createFactsList_2(data);
}
setCategories();
//createFactsList_2(loadData());
//wait for the promise to resolve using await or .then() before using the result.

loadData();
