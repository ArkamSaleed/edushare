// API Configuration
const API_URL = 'http://localhost:3000/api';

// Get current user
const user = JSON.parse(localStorage.getItem('user') || '{}');

// Authentication check
(function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || !user.id) {
        window.location.href = 'index.html';
        return;
    }
    
    // Display user info
    const userNameElements = document.querySelectorAll('.user-name');
    if (userNameElements.length > 0 && user.firstName) {
        userNameElements.forEach(el => {
            el.textContent = `${user.firstName} ${user.lastName}`;
        });
    }
})();

// Logout functionality
function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}

// Global variables
let allFiles = [];
let currentView = 'all';
let currentFileId = null;

// Modal elements
const uploadBtn = document.getElementById('uploadBtn');
const uploadModal = document.getElementById('uploadModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const filePreview = document.getElementById('filePreview');
const previewName = document.getElementById('previewName');
const previewSize = document.getElementById('previewSize');
const removeFile = document.getElementById('removeFile');
const uploadForm = document.querySelector('.upload-form');

let selectedFile = null;

// Load files on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFiles();
});

// Load files from backend
async function loadFiles() {
    try {
        const response = await fetch(`${API_URL}/files`);
        const data = await response.json();
        
        if (data.success) {
            allFiles = data.files;
            console.log('Files fetched from backend:', allFiles); // Debugging log
            console.log('Current user:', user); // Debugging log
            displayFiles(allFiles);
            updateFileCounts();
        }
    } catch (error) {
        console.error('Error loading files:', error);
        showMessage('Unable to load files. Make sure backend is running.', 'error');
    }
}

// Display files
function displayFiles(files) {
    const filesGrid = document.getElementById('filesGrid');
    
    if (files.length === 0) {
        filesGrid.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #666;">
                <p>No files to display.</p>
                <p>Click "Upload File" to get started!</p>
            </div>
        `;
        return;
    }
    
    filesGrid.innerHTML = files.map(file => {
        const isMyFile = file.uploadedBy.id === user.id; // Check if the current user uploaded the file
        const formattedSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
        const formattedDate = new Date(file.uploadedAt).toLocaleDateString();
        const avatarColor = file.uploadedBy.avatarColor || '#ccc';
        const initial = file.uploadedBy.firstName.charAt(0).toUpperCase();
        
        return `
            <div class="file-item" data-file-id="${file.id}">
                <div class="file-left">
                    <div class="file-icon-small ${file.type}">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="10" font-weight="600" font-family="Arial">
                                ${file.type.toUpperCase()}
                            </text>
                        </svg>
                    </div>
                    <span class="file-name">${file.fileName}</span>
                </div>
                <div class="file-right">
                    <span class="file-size">${formattedSize}</span>
                    <span class="file-date">${formattedDate}</span>
                    <div class="file-user">
                        <div class="user-avatar" style="background: ${avatarColor};">${initial}</div>
                        <span class="user-name">${file.uploadedBy.firstName} ${file.uploadedBy.lastName}</span>
                    </div>
                    <div class="file-actions-group">
                        ${isMyFile ? `
                            <button class="edit-btn" title="Edit" onclick="editFile('${file.id}')">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                            </button>
                            <button class="delete-btn" title="Delete" onclick="deleteFile('${file.id}')">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                            </button>
                        ` : ''}
                        <button class="comment-btn" title="Comments" onclick="openComments('${file.id}', '${file.fileName}')">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                        </button>
                        <button class="download-btn" title="Download" onclick="downloadFile('${file.id}', '${file.fileName}')">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Upload Modal functionality
uploadBtn.addEventListener('click', () => {
    uploadModal.classList.add('active');
});

closeModal.addEventListener('click', () => {
    uploadModal.classList.remove('active');
    resetForm();
});

cancelBtn.addEventListener('click', () => {
    uploadModal.classList.remove('active');
    resetForm();
});

uploadModal.addEventListener('click', (e) => {
    if (e.target === uploadModal) {
        uploadModal.classList.remove('active');
        resetForm();
    }
});

browseBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const file = e.dataTransfer.files[0];
    if (file) {
        handleFile(file);
    }
});

function handleFile(file) {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
    }
    
    selectedFile = file;
    
    document.querySelector('.drop-zone-content').style.display = 'none';
    filePreview.style.display = 'flex';
    
    previewName.textContent = file.name;
    previewSize.textContent = formatFileSize(file.size);
    
    const fileNameInput = document.getElementById('fileName');
    if (!fileNameInput.value) {
        fileNameInput.value = file.name;
    }
}

removeFile.addEventListener('click', () => {
    selectedFile = null;
    fileInput.value = '';
    document.querySelector('.drop-zone-content').style.display = 'flex';
    filePreview.style.display = 'none';
});

// Upload file to backend
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
        alert('Please select a file to upload');
        return;
    }
    
    const fileName = document.getElementById('fileName').value.trim() || selectedFile.name;
    const uploadButton = uploadForm.querySelector('button[type="submit"]');
    uploadButton.disabled = true;
    uploadButton.textContent = 'Uploading...';
    
    try {
        // Convert file to base64
        const base64 = await fileToBase64(selectedFile);
        
        const response = await fetch(`${API_URL}/files/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fileName: fileName,
                fileSize: selectedFile.size,
                fileType: selectedFile.type || 'application/octet-stream',
                fileData: base64,
                uploadedBy: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('File uploaded successfully!', 'success');
            uploadModal.classList.remove('active');
            resetForm();
            loadFiles(); // Reload files
        } else {
            showMessage(data.message || 'Upload failed', 'error');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showMessage('Error uploading file. Make sure backend is running.', 'error');
    } finally {
        uploadButton.disabled = false;
        uploadButton.textContent = 'Upload File';
    }
});

// Download file
async function downloadFile(fileId, fileName) {
    try {
        const response = await fetch(`${API_URL}/files/download/${fileId}`);
        const data = await response.json();
        
        if (data.success) {
            // Convert base64 to blob and download
            const blob = base64ToBlob(data.file.fileData, data.file.fileType);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showMessage('File downloaded successfully!', 'success');
        } else {
            showMessage('Error downloading file', 'error');
        }
    } catch (error) {
        console.error('Download error:', error);
        showMessage('Error downloading file', 'error');
    }
}

// Delete file
async function deleteFile(fileId) {
    const confirmation = confirm('Are you sure you want to delete this file?');
    if (!confirmation) return;

    try {
        const response = await fetch(`${API_URL}/files/${fileId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.id })
        });

        const data = await response.json();

        if (data.success) {
            showMessage('File deleted successfully.', 'success');
            // Reload files from backend
            loadFiles();
        } else {
            showMessage(data.message || 'Failed to delete file.', 'error');
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        showMessage('An error occurred while deleting the file.', 'error');
    }
}

// Comments Modal
const commentsModal = document.getElementById('commentsModal');
const closeCommentsModal = document.getElementById('closeCommentsModal');
const commentsFileName = document.getElementById('commentsFileName');
const addCommentBtn = document.getElementById('addCommentBtn');
const commentInput = document.getElementById('commentInput');
const commentsList = document.getElementById('commentsList');

function openComments(fileId, fileName) {
    currentFileId = fileId;
    commentsFileName.textContent = `Comments - ${fileName}`;
    commentsModal.classList.add('active');
    loadComments(fileId);
}

closeCommentsModal.addEventListener('click', () => {
    commentsModal.classList.remove('active');
    currentFileId = null;
});

commentsModal.addEventListener('click', (e) => {
    if (e.target === commentsModal) {
        commentsModal.classList.remove('active');
        currentFileId = null;
    }
});

// Load comments
async function loadComments(fileId) {
    try {
        const response = await fetch(`${API_URL}/comments/${fileId}`);
        const data = await response.json();
        
        if (data.success) {
            displayComments(data.comments);
        }
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

// Display comments
function displayComments(comments) {
    if (comments.length === 0) {
        commentsList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No comments yet. Be the first to comment!</p>';
        return;
    }
    
    commentsList.innerHTML = comments.map(comment => {
        const initial = comment.author.firstName.charAt(0).toUpperCase();
        const avatarColor = getAvatarColor(comment.author.firstName);
        const timeAgo = getTimeAgo(comment.createdAt);
        const isMyComment = comment.author.id === user.id;
        
        return `
            <div class="comment-item">
                <div class="comment-avatar" style="background: ${avatarColor};">${initial}</div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${isMyComment ? 'You' : comment.author.firstName + ' ' + comment.author.lastName}</span>
                        <span class="comment-time">${timeAgo}</span>
                    </div>
                    <p class="comment-text">${comment.text}</p>
                </div>
            </div>
        `;
    }).join('');
    
    commentsList.scrollTop = commentsList.scrollHeight;
}

// Add comment
addCommentBtn.addEventListener('click', async () => {
    const commentText = commentInput.value.trim();
    
    if (!commentText) {
        return;
    }
    
    if (!currentFileId) {
        showMessage('Error: No file selected', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/comments/${currentFileId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: commentText,
                author: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            commentInput.value = '';
            loadComments(currentFileId);
            loadFiles(); // Reload to update comment count
        } else {
            showMessage(data.message || 'Error adding comment', 'error');
        }
    } catch (error) {
        console.error('Error adding comment:', error);
        showMessage('Error adding comment', 'error');
    }
});

commentInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addCommentBtn.click();
    }
});

// Sidebar navigation
const navItems = document.querySelectorAll('.nav-item');
const sectionTitle = document.getElementById('sectionTitle');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        const view = item.dataset.view;
        currentView = view;
        
        const titles = {
            'all': 'All Files',
            'my': 'My Files'
        };
        sectionTitle.textContent = titles[view] || 'Files';
        
        filterFiles(view);
    });
});

// Filter files
function filterFiles(view) {
    let filteredFiles = allFiles;
    
    if (view === 'my') {
        filteredFiles = allFiles.filter(file => file.uploadedBy.id === user.id);
    }
    
    displayFiles(filteredFiles);
}

// Update file counts
function updateFileCounts() {
    const allCount = allFiles.length;
    const myCount = allFiles.filter(file => file.uploadedBy.id === user.id).length;
    
    document.querySelectorAll('.nav-item').forEach(item => {
        const view = item.dataset.view;
        const countSpan = item.querySelector('.count');
        
        if (countSpan) {
            if (view === 'all') {
                countSpan.textContent = allCount;
            } else if (view === 'my') {
                countSpan.textContent = myCount;
            }
        }
    });
}

// Add edit functionality to the frontend
async function editFile(fileId) {
    try {
        const file = allFiles.find(f => f.id === fileId);
        if (!file) {
            showMessage('File not found.', 'error');
            return;
        }

        // Check if the current user is the uploader
        if (file.uploadedBy.id !== user.id) {
            showMessage('You are not authorized to edit this file.', 'error');
            return;
        }

        // Prompt user for new file name
        const newFileName = prompt('Enter the new file name:', file.fileName);
        if (!newFileName || newFileName.trim() === '') {
            showMessage('File name cannot be empty.', 'error');
            return;
        }

        const response = await fetch(`${API_URL}/files/${fileId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileName: newFileName.trim() }),
        });

        const data = await response.json();

        if (data.success) {
            showMessage('File updated successfully.', 'success');
            file.fileName = newFileName.trim();
            displayFiles(allFiles);
        } else {
            showMessage(data.message || 'Failed to update file.', 'error');
        }
    } catch (error) {
        console.error('Error editing file:', error);
        showMessage('An error occurred while editing the file.', 'error');
    }
}

// Remove JavaScript pop-up and ensure modal functionality
function showEditFileModal(fileId) {
    const file = allFiles.find(f => f.id === fileId);
    if (!file) {
        console.error('File not found.');
        return;
    }

    // Populate modal fields with existing data
    const editFileNameInput = document.getElementById('editFileName');
    const editMentionPersonInput = document.getElementById('editMentionPerson');
    editFileNameInput.value = file.fileName;
    editMentionPersonInput.value = file.mention || '';

    // Show the modal
    const editFileModal = document.getElementById('editFileModal');
    editFileModal.classList.add('active');

    // Set up save button
    const saveEditFileButton = document.getElementById('saveEditFileBtn');
    saveEditFileButton.onclick = async () => {
        const newFileName = editFileNameInput.value.trim();
        const newMention = editMentionPersonInput.value.trim();

        if (!newFileName) {
            console.error('File name cannot be empty.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/files/${fileId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fileName: newFileName, mention: newMention }),
            });

            const data = await response.json();

            if (data.success) {
                console.log('File updated successfully.');
                file.fileName = newFileName;
                file.mention = newMention;
                displayFiles(allFiles);
                editFileModal.classList.remove('active');
            } else {
                console.error(data.message || 'Failed to update file.');
            }
        } catch (error) {
            console.error('An error occurred while updating the file:', error);
        }
    };

    // Set up cancel button
    const cancelEditFileButton = document.getElementById('cancelEditFileBtn');
    cancelEditFileButton.onclick = () => {
        editFileModal.classList.remove('active');
    };
}

// Attach event listeners to edit buttons
function attachEditFileButtonListeners() {
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const fileId = button.closest('.file-item').dataset.fileId;
            showEditFileModal(fileId);
        });
    });
}

// Call this function after rendering files
document.addEventListener('DOMContentLoaded', () => {
    attachEditFileButtonListeners();
});

// Utility functions
function resetForm() {
    uploadForm.reset();
    selectedFile = null;
    fileInput.value = '';
    document.querySelector('.drop-zone-content').style.display = 'flex';
    filePreview.style.display = 'none';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' min ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hr ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + ' days ago';
    
    return formatDate(dateString);
}

function getAvatarColor(name) {
    const colors = [
        'linear-gradient(135deg, #667eea, #764ba2)',
        'linear-gradient(135deg, #f093fb, #f5576c)',
        'linear-gradient(135deg, #4facfe, #00f2fe)',
        'linear-gradient(135deg, #43e97b, #38f9d7)',
        'linear-gradient(135deg, #fa709a, #fee140)',
        'linear-gradient(135deg, #30cfd0, #330867)',
        'linear-gradient(135deg, #a8edea, #fed6e3)',
        'linear-gradient(135deg, #ff9a9e, #fecfef)',
        'linear-gradient(135deg, #ffecd2, #fcb69f)',
        'linear-gradient(135deg, #ff6e7f, #bfe9ff)'
    ];
    
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
}

async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function base64ToBlob(base64, contentType) {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteArrays = [];
    
    for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
    }
    
    return new Blob([new Uint8Array(byteArrays)], { type: contentType });
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-box ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.right = '20px';
    messageDiv.style.zIndex = '10000';
    messageDiv.style.padding = '1rem 1.5rem';
    messageDiv.style.borderRadius = '8px';
    messageDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    
    if (type === 'success') {
        messageDiv.style.background = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
    } else {
        messageDiv.style.background = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '1px solid #f5c6cb';
    }
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}
