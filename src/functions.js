const loadJSON = async (path) => {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`${path}: ${response.status}`);
    return response.json();
};

const [experienceJSON, skillsJSON, languagesJSON, mainJSON, hobbiesJSON, contactJSON] = await Promise.all([
    loadJSON("src/JSON/expirience.json"),
    loadJSON("src/JSON/skills.json"),
    loadJSON("src/JSON/languagues.json"),
    loadJSON("src/JSON/main.json"),
    loadJSON("src/JSON/hobbies.json"),
    loadJSON("src/JSON/contact.json")
]);

const asideElement = document.getElementById("aside");
const descriptionSectionElement = document.getElementById("description");
const nameDivContainerElement = document.getElementById("name");
const professionalTitleElement = document.getElementById("professionalTitle");

const limitStars = 5;
const bornYear = 2002;
const bornDay = 19;
const bornMonth = 7;

const ui = {
    es: { download: "Descargar PDF", print: "Imprimir / Guardar PDF", language: "Idioma" },
    en: { download: "Download PDF", print: "Print / Save as PDF", language: "Language" }
};

// Helpers ------------------------------------------------------
export const getYearsOld = () => {
    const today = new Date();
    let age = today.getFullYear() - bornYear;
    const hadBirthday = today.getMonth() + 1 > bornMonth ||
        (today.getMonth() + 1 === bornMonth && today.getDate() >= bornDay);
    if (!hadBirthday) age--;
    return age;
};

const stripProtocol = (url) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");
const take = (items, max) => (max ? items.slice(0, max) : items);

const starSvg = {
    full: `<svg class="filled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>`,
    half: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true"><path d="M309.5 13.5C305.5 5.2 297.1 0 287.9 0s-17.6 5.2-21.6 13.5L197.7 154.8 44.5 177.5c-9 1.3-16.5 7.6-19.3 16.3s-.5 18.1 5.9 24.5L142.2 328.4 116 483.9c-1.5 9 2.2 18.1 9.7 23.5s17.3 6 25.3 1.7l137-73.2 137 73.2c8.1 4.3 17.9 3.7 25.3-1.7s11.2-14.5 9.7-23.5L433.6 328.4 544.8 218.2c6.5-6.4 8.7-15.9 5.9-24.5s-10.3-14.9-19.3-16.3L378.1 154.8 309.5 13.5zM288 384.7l0-305.6 52.5 108.1c3.5 7.1 10.2 12.1 18.1 13.3l118.3 17.5L391 303c-5.5 5.5-8.1 13.3-6.8 21l20.2 119.6L299.2 387.5c-3.5-1.9-7.4-2.8-11.2-2.8z"/></svg>`,
    empty: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>`
};

export const getStars = (value) => {
    const full = Math.floor(value);
    const half = value % 1 !== 0 ? 1 : 0;
    const empty = limitStars - full - half;
    return `<span class="sr-only">${value}/${limitStars}</span>` +
        starSvg.full.repeat(full) + starSvg.half.repeat(half) + starSvg.empty.repeat(Math.max(0, empty));
};

// Images from external CDNs can fail: show the initial instead of a broken icon
const handleBrokenImages = (root) => {
    root.querySelectorAll("img[data-fallback]").forEach((img) => {
        img.addEventListener("error", () => {
            const badge = document.createElement("span");
            badge.className = "icon-fallback";
            badge.textContent = img.dataset.fallback.charAt(0).toUpperCase();
            img.replaceWith(badge);
        }, { once: true });
    });
};

// Header -------------------------------------------------------
const renderToolbar = (state) => {
    document.getElementById("toolbar")?.remove();
    if (state.options.pdf) return;

    const t = ui[state.lang];
    const toolbar = document.createElement("nav");
    toolbar.id = "toolbar";
    toolbar.className = "toolbar";
    toolbar.setAttribute("aria-label", "CV");

    const languageSwitch = state.options.sls ? `
        <div class="lang-switch" role="group" aria-label="${t.language}">
            ${["es", "en"].map((lang) => `
                <button type="button" data-lang="${lang}" aria-pressed="${lang === state.lang}">${lang.toUpperCase()}</button>
            `).join("")}
        </div>` : "";

    // The pre-generated PDF only matches the unfiltered page; with filters, print the current view
    const downloadButton = state.options.filtered
        ? `<button type="button" class="btn-primary" data-action="print"><i class="fa-solid fa-file-pdf"></i><span>${t.download}</span></button>`
        : `<a class="btn-primary" href="./CV-Stiven-Diaz-${state.lang}.pdf" download><i class="fa-solid fa-file-arrow-down"></i><span>${t.download}</span></a>`;

    toolbar.innerHTML = `
        ${languageSwitch}
        ${downloadButton}
        <button type="button" class="btn-icon" data-action="print" title="${t.print}" aria-label="${t.print}">
            <i class="fa-solid fa-print"></i>
        </button>
    `;

    toolbar.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;
        if (button.dataset.action === "print") window.print();
        if (button.dataset.lang && button.dataset.lang !== state.lang) state.onLanguageChange(button.dataset.lang);
    });

    document.body.append(toolbar);

    // Float the download button once the header is out of view
    toolbarObserver?.disconnect();
    if ("IntersectionObserver" in window) {
        toolbarObserver = new IntersectionObserver(([entry]) => {
            toolbar.classList.toggle("is-floating", !entry.isIntersecting);
        }, { rootMargin: "-120px 0px 0px 0px" });
        toolbarObserver.observe(document.getElementById("header"));
    }
};
let toolbarObserver;

const renderSocialLinks = (lang) => {
    nameDivContainerElement.querySelector(".wrapper")?.remove();
    const wrapperElement = document.createElement("div");
    wrapperElement.classList.add("wrapper");
    wrapperElement.innerHTML = contactJSON[lang].map((contact) => `
        <a href="${contact.href}" target="_blank" rel="noopener" class="iconsocial ${contact.type.toLowerCase()}" aria-label="${contact.description}">
            <div class="tooltip">${contact.type}</div>
            <span><i class="${contact.fontawesomeIcon}"></i></span>
        </a>
    `).join("");
    nameDivContainerElement.append(wrapperElement);
};

// Main column --------------------------------------------------
const renderProfile = (lang, options) => {
    const data = mainJSON[lang];
    professionalTitleElement.textContent = data.professionalTitle;

    const profileElement = document.createElement("div");
    profileElement.classList.add("profile");

    const summary = options.hide.has("summary") ? "" : `
        <ul>
            ${data.professionalExperiences.map((ex) => `
                <h4>${ex.name}</h4>
                ${ex.descriptions.map((d) => `<li>${d}</li>`).join("")}
            `).join("")}
        </ul>`;

    const keySkills = options.hide.has("keyskills") ? "" : `
        <ul class="key-skills">
            <h4>${data.keySkills.name}</h4>
            ${data.keySkills.skills.map((d) => `<li class="keySkills">${d}</li>`).join("")}
        </ul>`;

    profileElement.innerHTML = `
        <h3>${data.appTitles.profile}</h3>
        <div id="presentation">${data.presentation.join("")}</div>
        <p>${data.description}</p>
        ${summary}
        ${keySkills}
    `;
    const yearsOld = profileElement.querySelector("#yearsOld");
    if (yearsOld) yearsOld.textContent = getYearsOld();
    return profileElement;
};

const renderEducation = (lang) => {
    const educationElement = document.createElement("div");
    educationElement.classList.add("education");
    educationElement.innerHTML = `
        <h3>${mainJSON[lang].appTitles.education}</h3>
        <div>
            ${experienceJSON[lang].education.map((item) => `
                <div class="card">
                    <div>
                        <h4>${item.institution}</h4>
                        ${item.logo ? `<figure><img src="${item.logo}" alt="${item.institution}" width="40" height="40" loading="lazy" decoding="async"></figure>` : ""}
                    </div>
                    <div>
                        <span>${item.degree}</span>
                        <span>${item.dates ?? ""}</span>
                    </div>
                </div>
            `).join("")}
        </div>
    `;
    return educationElement;
};

const renderProject = (project, options) => {
    const links = [...(project.link ? [project.link] : []), ...(project.links ?? [])];
    return `
        <div class="project">
            <div>
                <h6>${project.name}</h6>
                ${links.map((link) => `<span><a href="${link}" target="_blank" rel="noopener">${stripProtocol(link)}</a></span>`).join("")}
            </div>
            <ul>
                ${take(project.tasks, options.tasks).map((task) => `<li>${task}</li>`).join("")}
            </ul>
        </div>
    `;
};

const renderEmploymentHistory = (lang, options) => {
    const jobs = experienceJSON[lang].employment_history
        .filter((job) => !options.jobs.size || options.jobs.has(job.id));

    const historyElement = document.createElement("div");
    historyElement.classList.add("history");
    historyElement.innerHTML = `
        <h3>${mainJSON[lang].appTitles.employmentHistory}</h3>
        <div class="timeline">
            ${jobs.map((job) => {
                const company = job.link
                    ? `<a href="${job.link}" target="_blank" rel="noopener">${job.company}</a>`
                    : job.company;
                const logo = job.logo
                    ? `<figure class="${job.logoShape === "wide" ? "wide" : ""}"><img src="${job.logo}" alt="${job.company}" loading="lazy" decoding="async"></figure>`
                    : "";
                const projects = job.contributions ? take(job.contributions, options.projects) : [];
                return `
                    <div class="job">
                        <div>
                            <h4>${company}</h4>
                            ${logo}
                        </div>
                        <span>${job.position}</span>
                        <span>${job.dates}</span>
                        ${projects.length ? `<section>${projects.map((p) => renderProject(p, options)).join("")}</section>` : ""}
                    </div>
                `;
            }).join("")}
        </div>
    `;
    return historyElement;
};

// Aside --------------------------------------------------------
const renderSkills = (lang) => {
    const skillsElement = document.createElement("div");
    skillsElement.classList.add("skills");
    skillsElement.innerHTML = `
        <h4>${mainJSON[lang].appTitles.skills}</h4>
        <div id="skillsContent">
            ${skillsJSON.map((section) => `
                <section>
                    <h5>${section.section}</h5>
                    <div>
                        ${section.skills.map((skill) => `
                            <div class="card">
                                <div>
                                    <p>${skill.name}</p>
                                    <figure>
                                        <img src="${skill.svgIcon}" alt="${skill.name}" width="35" height="35" loading="lazy" decoding="async" data-fallback="${skill.name}">
                                    </figure>
                                </div>
                                <div class="level">${getStars(skill.knowledge)}</div>
                            </div>
                        `).join("")}
                    </div>
                </section>
            `).join("")}
        </div>
    `;
    return skillsElement;
};

const renderLanguages = (lang) => {
    const languagesElement = document.createElement("div");
    languagesElement.classList.add("languagues");
    languagesElement.innerHTML = `
        <h4>${mainJSON[lang].appTitles.languagues}</h4>
        <div id="languaguesContent">
            ${languagesJSON[lang].map((item) => `
                <div>
                    <p>${item.name}</p>
                    <div class="level">${getStars(item.knowledge)}</div>
                </div>
            `).join("")}
        </div>
    `;
    return languagesElement;
};

const renderHobbies = (lang) => {
    const hobbiesElement = document.createElement("div");
    hobbiesElement.classList.add("hobbies");
    hobbiesElement.innerHTML = `
        <h4>${mainJSON[lang].appTitles.hobbies}</h4>
        ${hobbiesJSON[lang].map((hobby) => `
            <div class="hnai">
                <p>${hobby.name}</p>
                <img class="block none himgs" src="${hobby.icon}" alt="" loading="lazy" />
            </div>
        `).join("")}
    `;
    return hobbiesElement;
};

const renderContact = (lang) => {
    const contactElement = document.createElement("div");
    contactElement.classList.add("contact");
    contactElement.innerHTML = `
        <h4>${mainJSON[lang].appTitles.contact}</h4>
        <div class="res-none">
            ${contactJSON[lang].map((contact) => `
                <div>
                    <label for="${contact.type.toLowerCase()}">${contact.type}:</label>
                    <a id="${contact.type.toLowerCase()}" href="${contact.href}" target="_blank" rel="noopener">${contact.value}</a>
                </div>
            `).join("")}
        </div>
        <div class="none block mini-footer">
            ${contactJSON[lang].map((contact) => `
                <a href="${contact.href}" target="_blank" rel="noopener" aria-label="${contact.description}">
                    <img class="himgs" src="${contact.icon}" alt="" />
                </a>
            `).join("")}
        </div>
    `;
    return contactElement;
};

// Animations ---------------------------------------------------
let revealObserver;
const setupReveal = (options) => {
    revealObserver?.disconnect();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (options.pdf || reduceMotion || !("IntersectionObserver" in window)) return;

    const groups = [
        "main h3, main aside > div > h4, #skillsContent h5",
        "#skillsContent section > div > div",
        ".profile #presentation, .profile > p, .profile ul > h4, .profile ul > li",
        ".education > div > div",
        ".history .job > div, .history .job > span, .history .project",
        "#languaguesContent > div, .hobbies > div, .contact > div"
    ];

    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

    groups.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el, index) => {
            // Only stagger siblings that enter together; long lists restart every few items
            el.style.setProperty("--reveal-delay", `${(index % 6) * 60}ms`);
            el.classList.add("reveal");
            revealObserver.observe(el);
        });
    });
};

// Render -------------------------------------------------------
export const renderApp = (state) => {
    const { lang, options } = state;
    const { hide } = options;

    document.documentElement.lang = lang;
    document.title = lang === "es" ? "Stiven Diaz | Currículum" : "Stiven Diaz | Resume";

    renderToolbar(state);
    renderSocialLinks(lang);

    const asideParts = [
        !hide.has("skills") && renderSkills(lang),
        !hide.has("languages") && renderLanguages(lang),
        !hide.has("hobbies") && renderHobbies(lang),
        !hide.has("contact") && renderContact(lang)
    ].filter(Boolean);

    const mainParts = [
        !hide.has("profile") && renderProfile(lang, options),
        !hide.has("education") && renderEducation(lang),
        !hide.has("experience") && renderEmploymentHistory(lang, options)
    ].filter(Boolean);

    asideElement.replaceChildren(...asideParts);
    descriptionSectionElement.replaceChildren(...mainParts);
    asideElement.hidden = asideParts.length === 0;

    handleBrokenImages(document.body);
    setupReveal(options);
    document.body.classList.add("is-ready");
};
