import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

const gallery = document.querySelector(`.gallery`);
const form = document.querySelector(`.search-form`);
form.addEventListener(`submit`, onSearchForm);
gallery.addEventListener(`click`, onPictureClick);

function onSearchForm(event) {
  event.preventDefault();
  // let searchQuery = null;
  const searchQuery = event.currentTarget.elements.searchQuery.value;
  console.log(searchQuery);
  fetchUrl(searchQuery);
}

function fetchUrl(searchRequest) {
  const KEY = `29526037-011b39b59387f2f37ea2d4748`;

  const URL = `https://pixabay.com/api/?key=${KEY}&q=${searchRequest}&image_type=photo&safesearch=true&orientation=horizontal&page=1&per_page=40`;

  const arrOfItems = fetch(`${URL}`)
    .then(res => res.json())
    .then(data => renderMarkUp(data));
}

function renderMarkUp(arr) {
  console.log(arr);

  const markUp = arr.hits.reduce((acc, hits) => {
    return (acc += `
    <div class="gallery__item" >
    <a class="photo-card" href="${hits.largeImageURL}">
   
  <img class="gallery__img" src="${hits.webformatURL}" alt="${hits.tags}" loading="lazy" />
  <a class="info">
    <p class="info-item">
      <b>Likes:${hits.likes}</b>
    </p>
    <p class="info-item">
      <b>Views:${hits.views}</b>
    </p>
    <p class="info-item">
      <b>Comments:${hits.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads:${hits.downloads}</b>
    </p>
  </a>
  </div>

    `);
  }, ``);

  gallery.innerHTML = markUp;
}

function onPictureClick(event) {
  event.preventDefault();

  if (event.target.nodeName !== 'IMG') {
    return;
  }
console.log(`+`);

  let bigPictures = new SimpleLightbox(`.gallery a`, {
    captionType: 'attr',
    captionsData: `alt`,
    captionDelay: 250,
  });

  bigPictures.on('show.simplelightbox', function () {});
}
