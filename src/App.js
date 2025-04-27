import { use, useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";

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

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function getCategoryColor(categoryName) {
  return (CATEGORIES.find((category) => category.name === categoryName) || {})
    .color;
}

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(
    function () {
      async function loadData() {
        setIsLoading(true);
        let query = supabase.from("facts").select("*");
        if (currentCategory !== "all") {
          query = query.eq("category", currentCategory);
        }
        const { data: facts, error } = await query
          .order("votesInteresting", { ascending: false })
          .limit(50);
        //console.log(facts);
        if (!error) setFacts(facts);
        else alert("Error loading the data ");
        setIsLoading(false);
      }
      loadData();
    },
    [currentCategory]
  );

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}
      <main>
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}

function Loader() {
  return <p>Loading...</p>;
}

function Header({ showForm, setShowForm }) {
  return (
    <header>
      <div className="logo">
        <img src="logo.png" width="68" height="68" alt="Logo" />
        <h1>Knowledge Forum</h1>
      </div>
      <button
        className="btn btn-large"
        id="show-form-btn"
        onClick={() => setShowForm((show) => !show)}
      >
        {showForm ? "Close" : "Share a fact"}
      </button>
    </header>
  );
}

function NewFactForm({ setFacts, setShowForm }) {
  const [factText, setFactText] = useState("");
  const [factSource, setFactSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function handleSubmit(e) {
    // 1. Prevent browser reload
    e.preventDefault(); // Default is reload

    //2. check if data is valid
    if (
      factText &&
      isValidHttpUrl(factSource) &&
      category &&
      factText.length <= 200
    ) {
      //console.log(factText, factSource, category);

      //3. create the new fact
      /*
      const newFact = {
        id: Math.round(Math.random() * 100000),
        text: factText,
        source: factSource,
        category,
        votesInteresting: 0,
        votesMindblowing: 0,
        votesFalse: 0,
        createdIn: new Date().getFullYear(),
      };
      */

      console.log(factText, factSource, category);

      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert({ text: factText, source: factSource, category })
        .select();

      setIsUploading(false);
      //4. add the new fact to the ui (stare)

      if (!error) setFacts((facts) => [newFact[0], ...facts]);

      //5. Reset the input field
      setFactText("");
      setFactSource("");
      setCategory("");

      //6. Close the form
      setShowForm(false);
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact"
        onChange={(e) => setFactText(e.target.value)}
        disabled={isUploading}
      />{" "}
      <span>{200 - factText.length}</span>
      <input
        type="text"
        placeholder="Trusworthy source (URL)"
        onChange={(e) => setFactSource(e.target.value)}
        disabled={isUploading}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Chose category</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <button
          className="btn btn-category"
          onClick={() => setCurrentCategory("all")}
        >
          All
        </button>
        {CATEGORIES.map((elem) => (
          <li key={elem.name}>
            <button
              className="btn btn-category"
              style={{ backgroundColor: elem.color }}
              onClick={() => setCurrentCategory(elem.name)}
            >
              {elem.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFacts }) {
  return (
    <section>
      <ul className="fact-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
      <p>Loaded {facts.length} facts</p>
    </section>
  );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed =
    fact.votesFalse > fact.votesInteresting + fact.votesMindblowing;
  async function handleVote(vote) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ [vote]: fact[vote] + 1 })
      .eq("id", fact.id)
      .select();

    setIsUpdating(false);

    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === updatedFact[0].id ? updatedFact[0] : f))
      );
  }

  return (
    <li className="fact">
      <p>
        {isDisputed ? <span className="disputed">[DISPUTED]</span> : null}
        {fact.text}
        <a className="source" href={fact.source} target="_blank">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{ backgroundColor: getCategoryColor(fact.category) }}
      >
        {fact.category}
      </span>
      <ul className="reactions">
        <li>
          <button
            onClick={() => handleVote("votesInteresting")}
            disabled={isUpdating}
          >
            👍 {fact.votesInteresting}
          </button>
        </li>
        <li>
          <button
            onClick={() => handleVote("votesMindblowing")}
            disabled={isUpdating}
          >
            🤯 {fact.votesMindblowing}
          </button>
        </li>
        <li>
          <button
            onClick={() => handleVote("votesFalse")}
            disabled={isUpdating}
          >
            ❌ {fact.votesFalse}
          </button>
        </li>
      </ul>
    </li>
  );
}

export default App;
