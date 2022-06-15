var img = null;
var reader = null;
var html5QrCode = null;
var url = null;
var timeout = null;

var hint = null;
var id = null;
var params = null;
const config = { fps: 10, qrbox: { width: 250, height: 250 } };

window.onload = function()
{
  img = document.getElementById`img`
  reader = document.getElementById`reader`
  html5QrCode = new Html5Qrcode("reader");

  var nbPlaces = places.length;
  url = window.location.href;
  if(url.indexOf`index.html` < 0)
  {
    if(url[url.length-1] != '/') url += '/';
    url += 'index.html';
  }
  if(url.indexOf`?` < 0)
  {
    url += '?step=1';
  }
  if(url != window.location.href) window.location.href = url

  params = {}
  url.split`?`[1].split`&`.map(x=>x.split`=`).map(x=>params[x[0]] = x[1])

  if(!params.step) window.location.href = url.split`?`[0]
  
  img.src = params.step+'.png';

  id = params.step - 1;

  hint = `<i>${places[id]}</i>`;
  if(id != undefined) 
  {
    var progress = document.getElementById('progressbar');
    progress.className = `w3-${['red', 'yellow', 'green'][~~(id * 3/(nbPlaces + 1))]}`;
    progress.style.width = ~~(id*100/nbPlaces)+'%';
  }
}

function showHint()
{
  showMessage(hint);
}

function showMessage(msg, keepDisplayed)
{
  window.clearTimeout(timeout);
  var elem = document.getElementById('message');
  elem.innerHTML = msg;
  elem.style.display = 'inline';
  if(!keepDisplayed)
    timeout = window.setTimeout(function(){elem.style.display = 'none';}, 2000);
}

var qrCodeSuccessCallback = (decodedText, decodedResult) => {
  var values = decodedText.split`->`
  if(values.length != 2 || values[0] != params.step)
  {
    alert("Non ce n'est pas bon !");
    swapVisibility();
    return;
  }
  if(values[1] == 'finale')
  {
    window.location.href = url.split`index.html?`[0]+'finale.html';
    return;
  }
  window.location.href = url.split`?`[0]+'?step='+values[1];
};

function start() {
  html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);
 }

function stop() {
  html5QrCode.stop().then((ignore) => {}).catch((err) => {});
}

function swapVisibility()
{
  if(reader.style.visibility == 'hidden')
  {
    reader.style.visibility = 'visible';
    start();
  } else {
    reader.style.visibility = 'hidden';
    stop();
  }
}

