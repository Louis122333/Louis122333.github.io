let currentPage = 1;
let loadingImg = false;
let refresh = false;
let main = document.querySelector('main');

function defaultCursor() {
    document.body.style.cursor = 'default';
} 

function loadCursor() {
    document.body.style.cursor = 'wait';
}

async function retrieveImages() {
    
    const apiKey = 'f50f8b32b8c49b8684e50eab8ab21e6c';
    let method = 'flickr.photos.search';
    let text = document.querySelector('input#text').value;
    const baseURL = 'https://api.flickr.com/services/rest';

    //Builds a query string depending on checkbox status. If it's checked: we add the "interestingess" parameter, default is "relevant"
    let url = `${baseURL}?api_key=${apiKey}&method=${method}&text=${text}&page=${currentPage}`;
    let relevant = `&format=json&nojsoncallback=1`;
    let interestingness = `&sort=interestingness-desc&format=json&nojsoncallback=1`;

    try {
        if(document.getElementById('sortInterest').checked) {
            let response = await fetch(url + interestingness); 
            let data = await response.json();
            return await data;
        }
        else {
            let response = await fetch(url + relevant); 
            let data = await response.json();
            return await data;
        }
    }
    catch(e) {
        console.error(e);
    }
}

function imgURL(img, size) {
    
    let imgSize = 'z'; //medium
    if(size == 'thumb') {imgSize = 'q'}
    if(size == 'large') {imgSize = 'b'}

    //Flickr img URL
    let url = `https://farm${img.farm}.staticflickr.com/${img.server}/${img.id}_${img.secret}_${imgSize}.jpg`;

    return url;
}

function updateUserInterface(data) {
    loadingImg = false;
    
    data.photos.photo.forEach(img => {
        if(img.farm !== 0) {
            let el = document.createElement('img');
            el.setAttribute('src', imgURL(img, 'thumb'));
            el.setAttribute('alt', img.title);

            el.addEventListener('click', () => {
                useImgGallery(img.title, imgURL(img, 'large'));
            })

            main.appendChild(el);
        }
    });  
}

//Open the lightbox
function useImgGallery(title, url) {

    document.querySelector('#overlay').classList.toggle('show');
    let el = document.querySelector('#overlay img');
    el.setAttribute('src', url);
    el.setAttribute('alt', title);
    document.querySelector('#overlay figcaption').innerHTML = title;
}

//Close the lightbox
document.querySelector('#overlay').addEventListener('click', () => {

    document.querySelector('#overlay').classList.toggle('show');
})

async function nextPage() {
    
    let images = await retrieveImages();
    updateUserInterface(images);
}

let lastKnownScrollPosition = 0;
let ticking = false;

function onScroll(scrollPos) {

}
document.addEventListener('scroll', function(e) {

  lastKnownScrollPosition = window.scrollY;

  if (!ticking && window.scrollY + window.innerHeight >= 
        document.documentElement.scrollHeight - 50) {

      window.requestAnimationFrame(function() {
      onScroll(lastKnownScrollPosition);
      console.log("scroll position: " + lastKnownScrollPosition);
      loadCursor();
      currentPage++;
      nextPage();
      ticking = false;
    });

    ticking = true;
  }
  defaultCursor();
  
});

document.querySelector('button').addEventListener('click', async () => {
    
    //get images if input is valid
    loadCursor();
    let images = await retrieveImages();
    let errorInputMsg = "Invalid Input:\nThe search bar is either empty or only contains whitespace, please type something and press Search.";
    let text = document.querySelector('input#text').value;
    if(!text.replace(/\s/g, '').length) {
        console.log(errorInputMsg);
    }
    else if(refresh === false) {
        while(main.firstChild) {
            main.removeChild(main.lastChild);
        }
        updateUserInterface(images);
        refresh = true;
    }
    else if(refresh === true) {
        while(main.firstChild) {
            main.removeChild(main.lastChild);
        }
        updateUserInterface(images);
        refresh = false;
    }
    defaultCursor();
});

//Scroll button:
mybutton = document.getElementById("myBtn");

// When the user scrolls down 300px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    mybutton.style.display = "block";
  } 
  else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}