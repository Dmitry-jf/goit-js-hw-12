
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { getImagesByQuery } from "./js/pixabay-api.js";
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  hideLoadMoreButton,
  showLoadMoreButton,
  gallery,
  refreshLightbox,
} from "./js/render-functions.js";


const refs = {
  form: document.querySelector('.form'),
   loadMoreBtn: document.querySelector(".loader-btn"),
};



const Page_Size = 15;
let query = "";
let currentPage;
let totalPages = 0;

hideLoadMoreButton();

refs.form.addEventListener('submit', async e => {
  e.preventDefault();

  const formData = new FormData(e.target);
  query = formData.get("search-text").trim();


  if (!query) {
    iziToast.warning({
      title: "",
      message: "Please enter a search query.",
      position: "topRight",
    });
    e.target.reset();
    return;
  }

  currentPage = 1;

  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, currentPage)


    if (!data.hits || data.hits.length === 0) {
      iziToast.error({
        title: "",
        message: "Sorry, there are no images matching your search query. Please try again!",
        position: "topRight",
      });
      return
    }

    const markup = createGallery(data.hits);
    gallery.innerHTML = markup;
        
    refreshLightbox();
 
    totalPages = Math.ceil(data.totalHits / Page_Size);

    
 if (currentPage < totalPages) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        title: "",
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
      });
      hideLoadMoreButton();
    }
  } catch (err) {
    console.error("Search error:", err);
    iziToast.error({
      title: "",
      message: "An error occurred while fetching images. Please try again.",
      position: "topRight",
    });
  } finally {
    hideLoader();
  }

  e.target.reset();
});


refs.loadMoreBtn.addEventListener("click", async () => {
  
    if (!query) return;
    currentPage += 1;

    showLoader();
    hideLoadMoreButton();


 try {
    const data = await getImagesByQuery(query, currentPage);
   
     if (!data.hits || data.hits.length === 0) {
      iziToast.info({
        title: "",
        message: "No more images found.",
        position: "topRight",
      });
      return;
    }

    const markup = createGallery(data.hits);
    gallery.insertAdjacentHTML("beforeend", markup);

    refreshLightbox();

    try {
      const firstCard = gallery.firstElementChild;
      if (firstCard) {
        const { height: cardHeight } = firstCard.getBoundingClientRect();
        window.scrollBy({
          top: cardHeight * 2,
          behavior: "smooth",
        });
      }
    } catch (scrollErr) {
      console.warn("Scroll adjustment failed:", scrollErr);
    }

    if (currentPage >= totalPages) {
      hideLoadMoreButton();
      iziToast.info({
        title: "",
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
      });
    } else {
      showLoadMoreButton();
    }
  } catch (err) {
    console.error("Load more error:", err);
    iziToast.error({
      title: "",
      message: "An error occurred while loading more images.",
      position: "topRight",
    });
  } finally {
    hideLoader();
  }
});