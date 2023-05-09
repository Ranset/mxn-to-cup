var myApp = new Framework7({
  swipePanel: 'left',
  material: true,
  modalTitle: 'Nezine',
  modalCloseByOutside: true,
  hideToolbarOnPageScroll: true,
  imagesLazyLoadThreshold: 50
});

var mainView = myApp.addView('.view-main', {
    domCache: true
});

let version = "RANOLI - v2.4.0";
document.getElementById("version").innerHTML = version;
document.getElementById("ver").innerHTML = version;