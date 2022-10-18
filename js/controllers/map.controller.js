function onInit() {
  renderPlaces()
}

function initMap() {
  const defaultLoc = { lat: -25.344, lng: 131.031 }

  // The map, centered at Uluru
  const map = new google.maps.Map(document.querySelector('.map'), {
    zoom: 4,
    center: defaultLoc,
  })

  // The marker, positioned at Uluru
  const marker = new google.maps.Marker({
    position: defaultLoc,
    map: map,
  })

  map.addListener('click', onAddPlace)
}

function onRemovePlace(id) {
  removePlace(id)
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
  renderPlaces()
}

function onUpdatePlace(id, newName) {
  updatePlace(id, newName)
}

function onChangeName(ev) {
  if (ev.key === 'Enter') ev.preventDefault()
}

function onSelectPlace() {
  //center map
}

function renderPlaces() {
  const places = getPlaces()
  console.log(places)
  const placesHTML = places.map(_renderPlace).join('')

  document.querySelector('.places-wrapper').innerHTML = placesHTML
}

function _renderPlace({ id, name, createdAt }) {
  //TODO: handle selected
  return `
    <article class="selected">
      <header>
        <h3
          contenteditable
          onblur="onUpdatePlace('${id}',this.innerText)"
          onkeydown="onChangeName(event)"
        >
          ${name}
        </h3>
        <i class="bi bi-x" onclick="onRemovePlace('${id}')"></i>
      </header>
      <span>Saved: <time>${_formatTime(createdAt)}</time></span>
    </article>`
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
