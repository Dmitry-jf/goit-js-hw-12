
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
  lightbox,
} from "./js/render-functions.js";


const refs = {
  form: document.querySelector('.form'),
   loadMoreBtn: document.querySelector(".loader-btn"),
};



const Page_Size = 15;
let query;
let currentPage;
let totalPages;

hideLoadMoreButton();

refs.form.addEventListener('submit', async e => {
    e.preventDefault();

    const formData = new FormData(e.target);
    query = formData.get("search-text").trim();
    currentPage = 1;


    clearGallery();
    hideLoadMoreButton();
    showLoader();

    try {
        const data = await getImagesByQuery(query, currentPage)
        hideLoader();



        if (data.hits.length === 0) {
            iziToast.error({
                title: "",
                message: "Sorry, there are no images matching your search query. Please try again!",
                position: "topRight",
            });
            return
        }

        const markup = createGallery(data.hits);
        gallery.innerHTML = markup;
        lightbox.refresh()
 
      totalPages = Math.ceil(data.totalHits / Page_Size);

    
        if (currentPage < totalPages) {
            showLoadMoreButton();
        }
    }
    catch {(err)
        console.error(err);
        hideLoader();
    }

    e.target.reset();
});



refs.loadMoreBtn.addEventListener("click", async () => {
    currentPage += 1;

    showLoader();
    hideLoadMoreButton();


 try {
    const data = await getImagesByQuery(query, currentPage);
     hideLoader();
     
    const markup = createGallery(data.hits);
    gallery.insertAdjacentHTML("beforeend", markup)
    lightbox.refresh();

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
    console.error(err);
    hideLoader();
  }
});