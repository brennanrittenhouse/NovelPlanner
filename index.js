import Story from './Story.js';
import Character from './Character.js';
import Relationship from './Relationship.js';

let novels = [];

// DOM
const addBtn = document.getElementById("addNovelBtn");
const form = document.getElementById("newStoryForm");
const cancelBtn = document.getElementById("cancelBtn");
const novelsListDiv = document.getElementById("novelsList");

const landingContent = document.getElementById("landingContent");
const detailView = document.getElementById("novelDetail");
const detailTitle = document.getElementById("detailTitle");
const detailAuthor = document.getElementById("detailAuthor");
const viewCharactersBtn = document.getElementById("viewCharactersBtn");
const homeBtn = document.getElementById("homeBtn");

// Progress bar elements
const progressBarInner = document.getElementById("progressBarInner");
const progressText = document.getElementById("progressText");

// Load stored
const saved = localStorage.getItem("novels");
if (saved) {
    const parsed = JSON.parse(saved);
    novels = parsed.map(storyData =>
        new Story(
            storyData.title,
            storyData.author,
            storyData.wordCount,
            storyData.goalWordCount,
            storyData.characters
        )
    );
}
renderNovels();

// Show form
addBtn.addEventListener("click", () => {
    form.style.display = "block";
});

// Cancel hides form
cancelBtn.addEventListener("click", () => {
    form.reset();
    form.style.display = "none";
});

// Save new story
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("titleInput").value.trim();
    const author = document.getElementById("authorInput").value.trim();
    const goal = document.getElementById("goalInput").value.trim();

    if (!title || !author) {
        alert("Title and Author are required!");
        return;
    }

    const newStory = new Story(
        title,
        author,
        0,
        goal ? parseInt(goal) : null,
        []
    );

    novels.push(newStory);
    localStorage.setItem("novels", JSON.stringify(novels));

    renderNovels();

    form.reset();
    form.style.display = "none";

    showNovelDetail(newStory);
});

// Render sidebar list
function renderNovels() {
    novelsListDiv.innerHTML = "";
    novels.forEach(story => {
        const div = document.createElement("div");
        div.textContent = `${story.title} by ${story.author}`;
        div.addEventListener("click", () => showNovelDetail(story));
        novelsListDiv.appendChild(div);
    });
}

// Show detail page
function showNovelDetail(story) {
    landingContent.style.display = "none";
    novelsListDiv.style.display = "none";
    detailView.style.display = "block";

    detailTitle.textContent = story.title;
    detailAuthor.textContent = `Author: ${story.author}`;

    updateProgress(story);

    viewCharactersBtn.onclick = () => {
        // Encode title into URL
        const encodedTitle = encodeURIComponent(story.title);
        window.location.href = `characterView.html?title=${encodedTitle}`;
    };
}

// Update progress bar
function updateProgress(story) {
    if (story.goalWordCount && story.goalWordCount > 0) {
        const percent = Math.min(
            100,
            Math.round((story.wordCount / story.goalWordCount) * 100)
        );

        progressBarInner.style.width = percent + "%";
        progressText.textContent = `${story.wordCount} / ${story.goalWordCount} words (${percent}%)`;
    } else {
        progressBarInner.style.width = "0%";
        progressText.textContent = "No word count goal set";
    }
}

// Home button back to landing
homeBtn.addEventListener("click", () => {
    detailView.style.display = "none";
    landingContent.style.display = "block";
    novelsListDiv.style.display = "block";
});
