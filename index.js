import Story from './Story.js';
import Character from './Character.js';
import Relationship from './Relationship.js';

let novels = [];

const addBtn = document.getElementById("addNovelBtn");
const form = document.getElementById("newStoryForm");
const cancelBtn = document.getElementById("cancelBtn");
const novelsListDiv = document.getElementById("novelsList");

const landingContent = document.getElementById("landingContent");
const detailView = document.getElementById("novelDetail");
const detailTitle = document.getElementById("detailTitle");
const detailAuthor = document.getElementById("detailAuthor");

const editStoryBtn = document.getElementById("editStoryBtn");
const editStoryForm = document.getElementById("editStoryForm");
const saveStoryChangesBtn = document.getElementById("saveStoryChangesBtn");
const cancelStoryEditBtn = document.getElementById("cancelStoryEditBtn");

const editTitleInput = document.getElementById("editTitleInput");
const editAuthorInput = document.getElementById("editAuthorInput");
const editGoalInput = document.getElementById("editGoalInput");
const editWordCountInput = document.getElementById("editWordCountInput");

const viewCharactersBtn = document.getElementById("viewCharactersBtn");
const deleteStoryBtn = document.getElementById("deleteStoryBtn");
const homeBtn = document.getElementById("homeBtn");

const progressBarInner = document.getElementById("progressBarInner");
const progressText = document.getElementById("progressText");

// Toast
const toastOverlay = document.getElementById("toastOverlay");
const toastMessage = document.getElementById("toastMessage");
const toastYes = document.getElementById("toastYes");
const toastNo = document.getElementById("toastNo");

// Load existing
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

// --- Show create story form ---
addBtn.addEventListener("click", () => form.style.display = "block");

// --- Cancel create form ---
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

// --- Render sidebar ---
function renderNovels() {
    novelsListDiv.innerHTML = "";
    novels.forEach(story => {
        const div = document.createElement("div");
        div.textContent = `${story.title} by ${story.author}`;
        div.addEventListener("click", () => showNovelDetail(story));
        novelsListDiv.appendChild(div);
    });
}

// --- Show detail view ---
function showNovelDetail(story) {
    landingContent.style.display = "none";
    novelsListDiv.style.display = "none";
    detailView.style.display = "block";

    detailTitle.textContent = story.title;
    detailAuthor.textContent = `Author: ${story.author}`;
    updateProgress(story);

    // Open edit form
    editStoryBtn.onclick = () => {
        editTitleInput.value = story.title;
        editAuthorInput.value = story.author;
        editGoalInput.value = story.goalWordCount || "";
        editWordCountInput.value = story.wordCount || 0;
        editStoryForm.style.display = "block";
    };

    // Save edits
    saveStoryChangesBtn.onclick = () => {
        story.title = editTitleInput.value.trim();
        story.author = editAuthorInput.value.trim();
        story.goalWordCount = editGoalInput.value ? parseInt(editGoalInput.value) : null;
        
        const wc = parseInt(editWordCountInput.value);
        if (!isNaN(wc) && wc >= 0) story.wordCount = wc;

        localStorage.setItem("novels", JSON.stringify(novels));
        renderNovels();
        updateProgress(story);

        detailTitle.textContent = story.title;
        detailAuthor.textContent = `Author: ${story.author}`;

        editStoryForm.style.display = "none";
    };

    // Cancel edit
    cancelStoryEditBtn.onclick = () => {
        editStoryForm.style.display = "none";
    };

    // View characters
    viewCharactersBtn.onclick = () => {
        const encodedTitle = encodeURIComponent(story.title);
        window.location.href = `characterView.html?title=${encodedTitle}`;
    };

    // Delete
    deleteStoryBtn.onclick = () => {
        toastMessage.textContent = `Delete "${story.title}"?`;
        toastOverlay.style.display = "flex";

        toastYes.onclick = () => {
            const index = novels.indexOf(story);
            novels.splice(index, 1);
            localStorage.setItem("novels", JSON.stringify(novels));

            toastOverlay.style.display = "none";
            detailView.style.display = "none";
            landingContent.style.display = "block";
            novelsListDiv.style.display = "block";
            renderNovels();
        };

        toastNo.onclick = () => toastOverlay.style.display = "none";
    };
}

// --- Progress ---
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

// --- Home ---
homeBtn.addEventListener("click", () => {
    detailView.style.display = "none";
    landingContent.style.display = "block";
    novelsListDiv.style.display = "block";
});
