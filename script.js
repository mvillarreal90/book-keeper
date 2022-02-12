const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarksForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = {};

function showModal() {
  modal.classList.add('show-modal');
  websiteNameEl.focus();
}

// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => e.target === modal ? modal.classList.remove('show-modal') : false);

// Validate Form
function validate(nameValue, urlValue) {
  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if(!nameValue || !urlValue) {
    alert('Please submit values for both fields');
    return false;
  }
  if(!urlValue.match(expression)) {
    alert('Please provide a valid URL');
    return false;
  }
  return true;
}

// Build Bookmarks DOM
function buildBookmarks() {
  // Remove existing bookmarks
  bookmarksContainer.textContent = '';
  // Build Items
  Object.keys(bookmarks).forEach((id) => {
    const { name, url } = bookmarks[id];
    // Item
    const item = document.createElement('div');
    item.classList.add('item');
    // Close
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas', 'fa-times');
    closeIcon.setAttribute('alt', 'Delete Bookmark');
    closeIcon.setAttribute('onclick', `deleteBookmark('${id}')`);
    // Favicon / Link Container
    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');
    // Favicon
    const favicon = document.createElement('img');
    favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
    favicon.setAttribute('alt', 'Favicon');
    // Link
    const link = document.createElement('a');
    link.setAttribute('href', `${url}`);
    link.setAttribute('target', '_blank');
    link.textContent = name;
    // Append to bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}

// Fetch Bookmarks From Local Storage
function fetchBookmarks() {
  if (localStorage.getItem('bookmarks')){
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  }
  buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(id) {
  if (bookmarks[id]) {
    delete bookmarks[id];
  }
  // Update Local Storage
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  buildBookmarks();
}

// Handle Data
function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (!urlValue.includes('http://', 'https://')) {
    urlValue = `https://${urlValue.toLowerCase()}`;
  }
  if (!validate(nameValue, urlValue)) {
    return false;
  }
  const bookmark = {
    name: nameValue,
    url: urlValue
  }
  bookmarks[urlValue] = bookmark;
  console.log(bookmarks);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  buildBookmarks();
  bookmarksForm.reset()
  websiteNameEl.focus();
}

// Event Listeners
bookmarksForm.addEventListener('submit', storeBookmark);

// On Load
fetchBookmarks();