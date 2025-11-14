let post = []

const postForm = document.getElementById('postForm');
const postTitleInput = document.getElementById('postTitle');
const titleError = document.getElementById('titleError');
const postContentInput = document.getElementById('postContent');
const contentError = document.getElementById('contentError');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('formTitle');
const postsContainer = document.getElementById('postsContainer');

window.addEventListener('DOMContentLoaded', function() {
    loadPostFromLocalStorage();
    renderPosts();
});

function savedPostsToLocalStorage() {
    localStorage.setItem('blogPost', JSON.stringify(posts));
    console.log('Posts Saved!, posts');
}

function loadPostFromLocalStorage() {
    const savedPosts = localStorage.getItem('BlogPosts');

    if (savedPosts) {
        posts = JSON.parse(savedPosts);
        console.log('Posts loaded...', posts);
    } else {
        posts = [];
        console.log('No posts found ):');
    }
}

function generateId() {
    return 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearError(errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

function validateTitle() {
    const title = postTitleInput.value.trim();
            
    if (postTitleInput.validity.valueMissing) {
        showError(titleError, "Put a title!");
        return false;
    } else if (postTitleInput.validity.tooShort) {
        showError(titleError, "Yup and its gotta be longer than 3 letters!");
        return false;
    } else {
        clearError(titleError);
        return true;
    }
}

function 