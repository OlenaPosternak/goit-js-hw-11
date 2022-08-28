import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Axios from 'axios';
import Notiflix from 'notiflix';

const gallery = document.querySelector(`.gallery`);
const form = document.querySelector(`.search-form`);
const loadMoreBtn = document.querySelector(`.load-more`);

let page = 1;
loadMoreBtn.style.display = `none`;

form.addEventListener(`submit`, onSearchForm);
gallery.addEventListener(`click`, onPictureClick);
loadMoreBtn.addEventListener(`click`, loadMoreItems);
let name = ``;

function onSearchForm(event) {
  cleanPage();
  event.preventDefault();
  name = event.currentTarget.elements.searchQuery.value;
  fetchUrl(name, page);
}

function fetchUrl(searchRequest, page = 1) {
  const KEY = `29526037-011b39b59387f2f37ea2d4748`;
  const URL = `https://pixabay.com/api/?key=${KEY}&q=${searchRequest}&image_type=photo&safesearch=true&orientation=horizontal&page=${page}&per_page=40`;
  //   console.log(obj.data.hits.length);

  const arrOfItems = Axios.get(`${URL}`).then(obj => {
    console.log(obj.data.totalHits);

    if (obj.data.hits.length === 0) {
      Notiflix.Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
    }

    renderMarkUp(obj.data);
  });

  return arrOfItems;
}

function renderMarkUp(arr) {
  const markUp = arr.hits.reduce((acc, hits) => {
    return (acc += `
    <div class="gallery__item" >
    <a class="photo-card" href="${hits.largeImageURL}">
   
  <img class="gallery__img" src="${hits.webformatURL}" alt="${hits.tags}" loading="lazy" />
  <a class="info">
    <p class="info-item"> Likes:${hits.likes}</p>
    <p class="info-item">Views:${hits.views}</p>
    <p class="info-item">Comments:${hits.comments}</p>
    <p class="info-item">Downloads:${hits.downloads}</p>
  </a>
  </div>

    `);
  }, ``);

  gallery.insertAdjacentHTML(`beforeend`, markUp);

  console.log(`+`, gallery.children.length);
  console.log(arr);

  if (arr.hits.length > 0) {
    setTimeout(() => {
      loadMoreBtn.style.display = `block`;
    }, 500);
  }

  if (
    (gallery.children.length === arr.totalHits ||
      gallery.children.length === 500) &&
    gallery.children.length != 0
  ) {
    console.log(`Кінець колекції, кнопка має заховатися!`);
    loadMoreBtn.style.display = `none`;
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function loadMoreItems() {
  fetchUrl(name, (page += 1)).then(renderMarkUp);
}

function cleanPage() {
  gallery.style.backgroundcolor = `#000`;
  loadMoreBtn.style.display = `none`;
  gallery.innerHTML = ``;
  page = 1;
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
