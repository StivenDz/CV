import { renderApp } from "./functions.js";

/*
 * Query parameters (all optional, combinable):
 *   lang=es|en             Language (default: browser language, else en)
 *   sls=false              Hide the language switch
 *   abb=true               Solid black header background
 *   pdf=true               PDF mode: no toolbar, no animations (used by `npm run pdf`)
 *   compact=true           Short version: hides the summary list and hobbies, max 2 bullets per project
 *   hide=a,b               Hide sections: skills, languages, hobbies, contact, profile,
 *                          summary, keyskills, education, experience
 *   jobs=a,b               Only these jobs: efletexia, neutica, mqa, asi
 *   projects=N             Max projects per job
 *   tasks=N                Max bullets per project
 */
const params = new URLSearchParams(window.location.search);

const readBool = (name, fallback) => {
    if (!params.has(name)) return fallback;
    return ["", "true", "1", "yes"].includes(params.get(name).toLowerCase());
};
const readList = (name) => new Set(
    (params.get(name) ?? "").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean)
);
const readInt = (name) => {
    const value = parseInt(params.get(name), 10);
    return Number.isFinite(value) && value > 0 ? value : null;
};

const compact = readBool("compact", false);
const hide = readList("hide");
if (compact) {
    hide.add("summary");
    hide.add("hobbies");
}

const options = {
    pdf: readBool("pdf", false),
    sls: readBool("sls", true),
    abb: readBool("abb", false),
    hide,
    jobs: readList("jobs"),
    projects: readInt("projects"),
    tasks: readInt("tasks") ?? (compact ? 2 : null)
};
options.filtered = Boolean(
    compact || options.hide.size || options.jobs.size || options.projects || options.tasks
);

const requestedLang = params.get("lang");
const browserLang = (navigator.language || "en").toLowerCase().startsWith("es") ? "es" : "en";

const state = {
    lang: ["es", "en"].includes(requestedLang) ? requestedLang : browserLang,
    options,
    onLanguageChange(lang) {
        // Keep the reader at the same place while the content swaps
        const scrollY = window.scrollY;
        state.lang = lang;
        params.set("lang", lang);
        history.replaceState(null, "", `${location.pathname}?${params}${location.hash}`);
        renderApp(state);
        window.scrollTo({ top: scrollY, behavior: "instant" });
    }
};

document.documentElement.classList.toggle("pdf-mode", options.pdf);
if (options.abb) document.getElementById("backpro").style.backgroundColor = "#000000";

renderApp(state);
