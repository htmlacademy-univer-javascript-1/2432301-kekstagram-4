import {isEscapeKey} from './util.js';
import {NUMBER_LOADED_COMMENTS} from './data.js';


const fullsizePicture = document.querySelector('.big-picture');
const body = document.body;
const closeButton = fullsizePicture.querySelector('#picture-cancel');
const loaderButton = fullsizePicture.querySelector('.comments-loader');
const currentComments = fullsizePicture.querySelector('.current-comments');
const commentTemplate = document.querySelector('#social__comment').content.querySelector('.social__comment');


const createComment = (comment) => {
  const clonedComment = commentTemplate.cloneNode(true);
  const {avatar, name, message} = comment;
  clonedComment.querySelector('.social__picture').src = avatar;
  clonedComment.querySelector('.social__picture').alt = name;
  clonedComment.querySelector('.social__text').textContent = message;
  clonedComment.classList.add('hidden');
  return clonedComment;
};

const fillComments = (comments) => {
  const commentsContainer = fullsizePicture.querySelector('.social__comments');
  const fragment = document.createDocumentFragment();
  comments.forEach((comment) => {
    const newComment = createComment(comment);
    fragment.append(newComment);
  });
  commentsContainer.innerHTML = '';
  commentsContainer.append(fragment);
};

const closePicture = () => {
  body.classList.remove('modal-open');
  fullsizePicture.classList.add('hidden');
  closeButton.removeEventListener('click', closePicture);
  document.removeEventListener('keydown', closeByEscape);
};

function closeByEscape() { //function должна использоваться как бы совместно с closePicture, иначе они закольцуются, то есть нужно (всплытие)
  if (isEscapeKey) {
    closePicture();
  }
}

const openComments = () => {
  const hiddenComments = fullsizePicture.querySelectorAll('.social__comment.hidden');
  let commentsNumber = NUMBER_LOADED_COMMENTS;
  const hiddenCommentsNumber = hiddenComments.length;
  if (hiddenCommentsNumber < NUMBER_LOADED_COMMENTS) {
    commentsNumber = hiddenCommentsNumber;
  }
  currentComments.textContent = Number(currentComments.textContent) + commentsNumber;
  for (let i = 0; i < commentsNumber; i++) {
    hiddenComments[i].classList.remove('hidden');
  }
  if (hiddenCommentsNumber - commentsNumber === 0) {
    fullsizePicture.querySelector('.comments-loader').classList.add('hidden');
  }
};

const openPicture = (picture) =>{
  body.classList.add('modal-open');
  fullsizePicture.classList.remove('hidden');
  const {url, description, likes, comments} = picture;
  fullsizePicture.querySelector('.big-picture__img img').src = url;
  fullsizePicture.querySelector('.likes-count').textContent = likes;
  fullsizePicture.querySelector('.comments-count').textContent = comments.length;
  fillComments(picture.comments);
  fullsizePicture.querySelector('.social__caption').textContent = description;
  fullsizePicture.querySelector('.comments-loader').classList.remove('hidden');
  currentComments.textContent = 0;
  openComments();
  loaderButton.addEventListener('click', openComments);
  closeButton.addEventListener('click', closePicture);
  document.addEventListener('keydown', closeByEscape);
};

export {openPicture};
