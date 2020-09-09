/*global giphyOptions*/

import Quill from 'quill';
import debounce from 'underscore/modules/debounce.js'
import './quill-giphy.css';

const Delta = Quill.import('delta');
const Module = Quill.import('core/module');

const giphyOptionsDefault = {
  apiBase: 'https://api.giphy.com/v1',
  apiKey: 'lBj9wdWfSYDszxMdstVhL6ODrxDLh8Xr', // https://developers.giphy.com/docs/api#quick-start-guide
  minimumCharactersToSearch: 3,
  debounceAPIRequestsMs: 300,
}

const giphyOptionsCombined = typeof giphyOptions !== 'undefined' ? {...giphyOptionsDefault, ...giphyOptions} : {...giphyOptionsDefault};
let giphyCollection = [];

class Giphy extends Module {
  constructor(quill, options) {
    super(quill, options);

    this.quill = quill;
    this.toolbar = quill.getModule('toolbar');
    if (typeof this.toolbar !== 'undefined')
      this.toolbar.addHandler('giphy', this.checkPaletteExist);

    var giphyBtns = document.getElementsByClassName('ql-giphy');
    if (giphyBtns) {
      [].slice.call( giphyBtns ).forEach(function ( giphyBtn ) {
        giphyBtn.innerHTML = options.buttonIcon;
      });
    }
  }

  checkPaletteExist() {
    let quill = this.quill;
    fn_checkDialogOpen(quill);
    this.quill.on('text-change', function(delta, oldDelta, source) {
      if (source === 'user') {
        fn_close();
        fn_updateRange(quill);
      }
    });
  }
}

Giphy.DEFAULTS = {
  buttonIcon: '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 19.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0) --><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"  viewBox="0 0 551.4 129.2" style="enable-background:new 0 0 551.4 129.2;" xml:space="preserve"><style type="text/css"> .st0{fill:#282828;}</style><g> <path class="st0" d="M117.3,55c0-3.3-0.6-4.5-4.2-4.4c-8.2,0.3-16.3,0.1-24.5,0.1c-8.6,0-17.2,0.1-25.7,0c-2.2,0-3.2,0.5-3.1,2.9  c0.2,6.8,0.2,13.6,0.1,20.4c0,2.1,0.6,2.8,2.8,2.7c4.8-0.2,9.5-0.1,14.3,0c3.9,0,9.9-1.3,11.3,0.6c2,2.8,1,8,0.8,12.1  c-0.1,1.3-1.3,3.1-2.6,3.8C80.1,96.9,73,98,65.7,97.7C53,97.2,43.5,91.9,38.4,79.8c-3.3-8-4.1-16.3-2.4-24.8  c2.4-11.8,8.1-20.8,20.4-23.9c12.4-3.1,24.1-1.3,34.4,6.7c2.9,2.3,4.3,1.7,6.4-0.7c3.6-4.1,7.5-7.9,11.3-11.8  c4.5-4.6,4.5-4.5-0.4-8.8C93.8,3.7,76.7,0.3,58.3,2.3c-25.4,2.8-43.4,15.3-52.1,40C2,54.1,1.4,66.2,3.9,78.4  c4,18.8,13.2,33.6,31.6,41.3c16.4,6.9,33.4,8.2,50.7,3.8c10.3-2.6,20-6.2,27-14.8c2.7-3.3,4.1-6.9,4-11.2  C117.2,83.3,117.1,69.2,117.3,55z"/> <path class="st0" d="M414.9,64c0-18.3-0.1-36.5,0.1-54.8c0-2.7-0.4-3.8-3.5-3.7c-8.7,0.2-17.4,0.2-26.2,0c-2.7-0.1-3.4,0.8-3.4,3.4  c0.1,12.4-0.2,24.8,0,37.2c0,3.2-1,3.7-3.9,3.7c-11.6-0.2-23.2-0.2-34.7,0c-3,0.1-3.5-1-3.4-3.7c0.1-12.5,0-25.1,0.1-37.6  c0-2.2-0.4-3.1-2.8-3c-9.1,0.1-18.3,0.1-27.4,0c-2.2,0-3.1,0.4-3.1,2.9c0.1,37.1,0.1,74.1,0,111.2c0,2.3,0.6,3,2.9,3  c9.1-0.1,18.3-0.2,27.4,0c2.8,0.1,3-1.1,3-3.3c-0.1-12.4,0-24.8-0.1-37.2c0-2.5,0.6-3.2,3.1-3.2c12,0.1,24,0.2,36,0  c2.9,0,3.3,1,3.3,3.5c-0.1,12.3,0,24.5-0.1,36.8c0,2.6,0.5,3.5,3.3,3.4c8.6-0.2,17.2-0.2,25.7,0c3.1,0.1,3.8-0.8,3.8-3.8  C414.8,100.5,414.9,82.2,414.9,64z"/> <path class="st0" d="M255.8,5.7c-19.9-0.5-39.8-0.3-59.6-0.5C193,5.2,192,6,192,9.3c0.2,18.2,0.1,36.5,0.1,54.7  c0,18.4,0,36.8,0,55.2c0,2.4,0.4,3.4,3.1,3.3c9.3-0.2,18.5-0.2,27.8,0c2.6,0,3.2-0.8,3.2-3.2c-0.1-8.4,0-16.9-0.1-25.3  c0-2.5,0.7-3.2,3.2-3.2c7.9,0.1,15.8,0.2,23.7-0.2c10.5-0.5,20.5-2.9,28.8-9.8c13.2-10.9,18.1-30.2,12.2-47.7  C288.5,17.5,273.2,6.1,255.8,5.7z M248.6,62.8c-6.7,0.1-13.3-0.1-20,0.1c-2.8,0.1-3.4-0.9-3.2-3.4c0.2-3.7,0-7.3,0-11  c0-4.1,0.1-8.2,0-12.2c-0.1-2,0.6-2.6,2.5-2.5c7.1,0.1,14.1-0.2,21.2,0.1c8.6,0.3,14,6.4,13.9,14.9  C262.7,57.5,257.5,62.7,248.6,62.8z"/> <path class="st0" d="M548.6,5.5c-10.6,0-21.2-0.1-31.9,0.1c-1.5,0-3.5,1.2-4.4,2.5c-7.3,11.2-14.4,22.4-21.3,33.8  c-2.1,3.5-2.9,2.8-4.7-0.2c-6.6-11.2-13.5-22.3-20.2-33.5c-1.2-2-2.5-2.7-4.8-2.7c-10.3,0.1-20.7,0-31.1,0.1  c-1.1,0-2.3,0.3-3.4,0.5c0.5,0.9,0.9,1.9,1.5,2.8c13.8,21.5,27.7,43,41.4,64.6c1.1,1.7,1.7,4,1.8,6c0.2,13.2,0.1,26.4,0,39.6  c0,2.5,0.4,3.6,3.3,3.5c9-0.2,18-0.2,27,0c2.7,0.1,3.1-0.9,3.1-3.3c-0.1-6.8-0.1-13.6-0.1-20.4c0-6.5-0.2-13.1,0.1-19.6  c0.1-2.2,0.8-4.6,2-6.3c14.3-21.5,28.8-42.9,43.2-64.3c0.6-0.8,0.8-1.8,1.3-2.8C550.5,5.6,549.6,5.5,548.6,5.5z"/> <path class="st0" d="M169.1,8.1c0-2.4-0.7-2.9-3-2.9c-8.8,0.1-17.7,0.2-26.5,0c-3-0.1-3.5,0.9-3.5,3.6c0.1,18.2,0.1,36.5,0.1,54.7  c0,18.5,0,37,0,55.5c0,2.5,0.3,3.6,3.2,3.5c8.8-0.2,17.7-0.1,26.5,0c2.3,0,3.3-0.2,3.3-3C169,82.5,169,45.3,169.1,8.1z"/></g></svg>'
};

function fn_close(){
  let ele_giphy_palette = document.getElementById('giphy-palette');
  document.getElementById('giphy-close-div').style.display = "none";
  if (ele_giphy_palette) {ele_giphy_palette.remove()}
}

function fn_checkDialogOpen(quill){
  let elementExists = document.getElementById("giphy-palette");
  if (elementExists) {
    elementExists.remove();
  }
  else{
    fn_showGiphyPalette(quill);
  }
}

function fn_updateRange(quill){
  let range = quill.getSelection();
  return range;
}

function fn_showGiphyPalette(quill) {
  let ele_giphy_area = document.createElement('div');
  let range = quill.getSelection();
  const atSignBounds = quill.getBounds(range.index);

  quill.container.appendChild(ele_giphy_area);
  let paletteMaxPos = atSignBounds.left + 250; // palette max width is 250
  ele_giphy_area.id = 'giphy-palette';
  ele_giphy_area.style.top = 10 + atSignBounds.top + atSignBounds.height + "px";
  if (paletteMaxPos > quill.container.offsetWidth) {
    ele_giphy_area.style.left = (atSignBounds.left - 250)+ "px";
  }
  else{
    ele_giphy_area.style.left = atSignBounds.left + "px";
  }

  let searchContainer = document.createElement('div');
  searchContainer.id="giphy-search-container";
  ele_giphy_area.appendChild(searchContainer);

  let searchLabel = document.createElement('label');
  let searchText = document.createTextNode("Search: ");
  searchLabel.appendChild(searchText);
  searchLabel.id="giphy-search-label";
  searchLabel.for="giphy-search-input";
  searchContainer.appendChild(searchLabel);

  let searchInput = document.createElement('input');
  searchInput.id="giphy-search-input";
  searchInput.name="giphy-search-input";
  searchContainer.appendChild(searchInput);
  searchInput.focus();

  searchInput.addEventListener("change", fn_searchAPIDebounced.bind(null, quill), false);
  searchInput.addEventListener("keyup", fn_searchAPIDebounced.bind(null, quill), false);

  let searchResultContainer = document.createElement('div');
  searchResultContainer.id="giphy-search-result-container";
  ele_giphy_area.appendChild(searchResultContainer);

  if (document.getElementById('giphy-close-div') === null) {
    let closeDiv = document.createElement('div');
    closeDiv.id = 'giphy-close-div';
    closeDiv.addEventListener("click", fn_close, false);
    document.getElementsByTagName('body')[0].appendChild(closeDiv);
  }
  else{
    document.getElementById('giphy-close-div').style.display = "block";
  }
}

function fn_searchAPI(quill, event) {
  console.log('event, quill', event, quill)
  const searchInput = event.target.value;
  console.log('searchInput', searchInput)

  if (searchInput.length >= giphyOptionsCombined.minimumCharactersToSearch) {
    const encodedSearch = encodeURIComponent(searchInput);
    const giphyRequest = fetch(`${giphyOptionsCombined.apiBase}/gifs/search?q=${encodedSearch}&api_key=${giphyOptionsCombined.apiKey}&limit=5`)
      .then(response => response.json())
      .then((response) => {
        console.log('response', response)
        if (response.data && typeof response.data === 'object') {
          giphyCollection = response.data.map(item => {return { src: item.images.original.url, icon: `<img src="${item.images.original.url}" />`, text: `Select ${item.title}`, title: item.title}});

          fn_giphyElementsToPanel(quill, giphyCollection);
        }
      });
  }
}

const fn_searchAPIDebounced = debounce(fn_searchAPI, giphyOptionsCombined.debounceAPIRequestsMs)

function fn_giphyElementsToPanel(quill, collection){
  const searchResultContainer = document.getElementById("giphy-search-result-container");
  quill.focus();
  let range = fn_updateRange(quill);

  searchResultContainer.innerHTML = "";

  collection.map(function(giphy_item) {
    let resultDiv = document.createElement('div');
    let t = document.createTextNode(giphy_item.text);
    resultDiv.appendChild(t);
    resultDiv.classList.add('giphy-search-result');
    resultDiv.innerHTML = giphy_item.icon;
    searchResultContainer.appendChild(resultDiv);

    if (resultDiv) {
      resultDiv.addEventListener('click', function() {
        quill.insertEmbed(range.index, 'image', giphy_item.src, Quill.sources.USER);
        quill.formatText(0, 1, 'alt', giphy_item.title);
        
        setTimeout(() => quill.setSelection(range.index + 1), 0);
        fn_close();
      });
    }
  });
}

function fn_updateGiphyContainer(giphyFilter,panel,quill){
  while (panel.firstChild) {
    panel.removeChild(panel.firstChild);
  }
  let type = giphyFilter.dataset.filter;
  fn_giphyElementsToPanel(type,panel,quill);
}

Quill.register({
  'modules/giphy': Giphy,
}, true);

export default { Giphy };
