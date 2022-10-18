var gMap = {
  map: '',
  markers: [],
}

function onInit() {
  renderPlaces()
}

function initMap() {
  const defaultLoc = { lat: -25.344, lng: 131.031 }

  // The map, centered at Uluru
  gMap.map = new google.maps.Map(document.querySelector('.map'), {
    zoom: 4,
    center: defaultLoc,
  })

  gMap.map.addListener('click', onAddPlace)
  getPlaces().forEach(addMarker)
}

function onRemovePlace(ev, id) {
  ev.stopPropagation()
  const removedPlace = removePlace(id)
  removeMarker(removedPlace)
  renderPlaces()
}

function onAddPlace({ latLng }) {
  const place = {
    id: Date.now().toString(),
    lat: latLng.lat(),
    lng: latLng.lng(),
    name: prompt('Place name?'),
  }
  console.log(place)
  addPlace(place)
  addMarker(place)
  renderPlaces()
}

function onUpdatePlace(id, newName) {
  updatePlace(id, newName)
}

function onChangeName(ev) {
  if (ev.key === 'Enter') ev.preventDefault()
}

function onSelectPlace(ev, el, id) {
  //center map
  console.log(ev, el, id)
  const elSelected = document.querySelector('article.selected')
  elSelected && elSelected.classList.remove('selected')
  el.classList.add('selected')

  const { lat, lng } = getPlace(id)
  gMap.map.setCenter(new google.maps.LatLng(lat, lng))
}

function renderPlaces() {
  const places = getPlaces()
  const placesHTML = places.map(_renderPlace).join('')

  document.querySelector('.places-wrapper').innerHTML = placesHTML
}

function addMarker({ lat, lng }) {
  const marker = new google.maps.Marker({
    position: { lat, lng },
    map: gMap.map,
  })
  gMap.markers.push(marker)
}

function removeMarker({ lat, lng }) {
  const marker = gMap.markers.find(
    ({ position: pos }) => lat === pos.lat() && lng === pos.lng()
  )
  marker.setMap(null)
}

function _renderPlace({ id, name, createdAt }) {
  return `
    <article onclick="onSelectPlace(event,this,'${id}')">
      <header>
        <h3
          contenteditable
          onblur="onUpdatePlace('${id}',this.innerText)"
          onkeydown="onChangeName(event)"
          onclick="stopPropagation(event)"
        >
          ${name}
        </h3>
        <i class="bi bi-x" onclick="onRemovePlace(event,'${id}')"></i>
      </header>
      <span>Saved: <time>${_formatTime(createdAt)}</time></span>
    </article>`
}

function stopPropagation(ev) {
  ev.stopPropagation()
}

function _formatTime(date) {
  date = new Date(date)
  const [year, month, day, hours, minutes] = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours().toString().padStart(2, '0'),
    date.getMinutes().toString().padStart(2, '0'),
  ]
  return `${day}/${month}/${year}, ${hours}:${minutes}`
}
