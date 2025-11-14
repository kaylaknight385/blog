let posts = []

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

function savePostsToLocalStorage() {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    console.log('Posts Saved!', posts);
}

function loadPostFromLocalStorage() {
    const savedPosts = localStorage.getItem('blogPosts');

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
        showError(titleError, "Yup and its gotta be longer than 3 characters!");
        return false;
    } else {
        clearError(titleError);
        return true;
    }
}

function validateContent() {
    const content = postContentInput.value.trim();

    if (postContentInput.validity.valueMissing) {
        showError(contentError, "Type SUMN");
        return false;
    } else if (postContentInput.validity.tooShort) {
        showError(contentError, "Mhm nice and looong. at LEAT 10 characters");
        return false; 
    } else {
        clearError(contentError);
        return true;
    }
}

postTitleInput.addEventListener('input', validateTitle);
postContentInput.addEventListener('input', validateContent);

function renderPosts() {
    postsContainer.innerHTML = '';

    if (posts.length === 0) {
        postsContainer.innerHTML = `
            <div class="empty-state">
                <div style="Font-size: 3rem;"></div>
                <p>No post yet!<p>
            </div>`;
        return;
    }

    const sortedPosts = [...posts].reverse();

    sortedPosts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.dataset.id = post.id;
    
        postCard.innerHTML = `
            <div class="post-header">
                <h3 class="post-title">${escapeHtml(post.title)}</h3>
                <span class="post-timestamp">${formatDate(post.timestamp)}</span>
            </div>
            <p class="post-content">${escapeHtml(post.content)}</p>
                <div class="post-actions">
                    <button class="btn-edit" data-id="${post.id}">Edit</button>
                    <button class="btn-delete" data-id="${post.id}">Delete</button>
                </div>
            `; 
        postsContainer.appendChild(postCard);
    });

    attachPostEventListeners();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function attachPostEventListeners() {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', handleDelete);
    });
}

postForm.addEventListener('submit', function(event) {
    event.preventDefault(); 

    const isTitleValid= validateTitle();
    const isContentValid = validateContent();
    if (!isTitleValid || !isContentValid) {
        return;
    }

    const title = postTitleInput.value.trim();
    const content = postContentInput.value.trim();

    createPost(title, content);
});

 function createPost(title, content) {
    const newPost = {id: generateId(), title: title, content: content, timestamp: Date.now()};
            
    posts.push(newPost);
    savePostsToLocalStorage();
    renderPosts();
            
    postForm.reset();
    clearError(titleError);
    clearError(contentError);
            
    console.log('New post created:', newPost);
}

function handleDelete(event) {
    const postId = event.target.dataset.id;
            
    if (!confirm('Are you sure you want to delete this post?')) {
                return;
    }

    posts = posts.filter(p => p.id !== postId);
            
    savePostsToLocalStorage();
    renderPosts();

    console.log('Post deleted:', postId);
}