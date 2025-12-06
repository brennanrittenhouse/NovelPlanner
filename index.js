import Story from './Story.js';
import Character from './Character.js';
import Relationship from './Relationship.js';

let novels = [];

// --- DOM Elements ---
const addBtn = document.getElementById("addNovelBtn");
const form = document.getElementById("newStoryForm");
const cancelBtn = document.getElementById("cancelBtn");
const novelsListDiv = document.getElementById("novelsList");

const landingContent = document.getElementById("landingContent");
const detailView = document.getElementById("novelDetail");
const detailTitle = document.getElementById("detailTitle");
const detailAuthor = document.getElementById("detailAuthor");
const viewCharactersBtn = document.getElementById("viewCharactersBtn");
const deleteStoryBtn = document.getElementById("deleteStoryBtn");
const homeBtn = document.getElementById("homeBtn");

const updateWordCountBtn = document.getElementById("updateWordCountBtn");
const updateWordCountForm = document.getElementById("updateWordCountForm");
const wordCountInput = document.getElementById("wordCountInput");
const saveWordCountBtn = document.getElementById("saveWordCountBtn");

// Progress bar
const progressBarInner = document.getElementById("progressBarInner");
const progressText = document.getElementById("progressText");

// Toast
const toastOverlay = document.getElementById("toastOverlay");
const toastMessage = document.getElementById("toastMessage");
const toastYes = document.getElementById("toastYes");
const toastNo = document.getElementById("toastNo");

// --- Load existing novels ---
const saved = localStorage.getItem("novels");
if (saved) {
    const parsed = JSON.parse(saved);
    novels = parsed.map(storyData =>
        new Story(
            storyData.title,
            storyData.author,
            storyData.wordCount,
            storyData.goalWordCount,
            storyData.characters || []
        )
    );
}
renderNovels();

// --- Show form ---
addBtn.addEventListener("click", () => form.style.display = "block");

// --- Cancel form ---
cancelBtn.addEventListener("click", () => {
    form.reset();
    form.style.display = "none";
});

// --- Save new story ---
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

// --- Render novels ---
function renderNovels() {
    novelsListDiv.innerHTML = "";
    novels.forEach(story => {
        const div = document.createElement("div");
        div.textContent = `${story.title} by ${story.author}`;
        div.addEventListener("click", () => showNovelDetail(story));
        novelsListDiv.appendChild(div);
    });
}

// --- Show novel detail page ---
function showNovelDetail(story) {
    landingContent.style.display = "none";
    novelsListDiv.style.display = "none";
    detailView.style.display = "block";

    detailTitle.textContent = story.title;
    detailAuthor.textContent = `Author: ${story.author}`;

    updateProgress(story);

    // --- Buttons ---
    viewCharactersBtn.onclick = () => {
        const encodedTitle = encodeURIComponent(story.title);
        window.location.href = `characterView.html?title=${encodedTitle}`;
    };

    deleteStoryBtn.onclick = () => {
        toastMessage.textContent = `Are you sure you want to delete "${story.title}"?`;
        toastOverlay.style.display = "flex";

        toastYes.onclick = () => {
            const index = novels.findIndex(s => s.title === story.title);
            if (index !== -1) novels.splice(index, 1);
            localStorage.setItem("novels", JSON.stringify(novels));
            toastOverlay.style.display = "none";
            detailView.style.display = "none";
            landingContent.style.display = "block";
            novelsListDiv.style.display = "block";
            renderNovels();
        };

        toastNo.onclick = () => toastOverlay.style.display = "none";
    };

    // --- Update Word Count ---
    updateWordCountForm.style.display = "none"; // hide initially
    updateWordCountBtn.onclick = () => {
        wordCountInput.value = story.wordCount;
        updateWordCountForm.style.display = "block";
    };

    saveWordCountBtn.onclick = () => {
        const val = parseInt(wordCountInput.value);
        if (!isNaN(val) && val >= 0) {
            story.wordCount = val;
            localStorage.setItem("novels", JSON.stringify(novels));
            updateProgress(story);
            updateWordCountForm.style.display = "none";
        } else {
            alert("Please enter a valid non-negative number.");
        }
    };
}

// --- Update progress bar ---
function updateProgress(story) {
    if (story.goalWordCount && story.goalWordCount > 0) {
        const percent = Math.min(100, Math.round((story.wordCount / story.goalWordCount) * 100));
        progressBarInner.style.width = percent + "%";
        progressText.textContent = `${story.wordCount} / ${story.goalWordCount} words (${percent}%)`;
    } else {
        progressBarInner.style.width = "0%";
        progressText.textContent = `${story.wordCount} words (no goal set)`;
    }
}

// --- Home button ---
homeBtn.addEventListener("click", () => {
    detailView.style.display = "none";
    landingContent.style.display = "block";
    novelsListDiv.style.display = "block";
});
