var gMap = {
  map: '',
  markers: [],
}

function onInit() {
  renderColors() //from user-pref
  renderPlaces()
  renderSelection()
}

function initMap() {
  const { mapLocation = { lat: -25, lng: 131 }, zoom = 6 } = getPreferences()

  gMap.map = new google.maps.Map(document.querySelector('.map'), {
    zoom,
    center: mapLocation,
  })

  gMap.map.addListener('click', onAddPlace)
  getPlaces().forEach(addMarker)
}

function renderSelection() {
  const { mapLocation } = getPreferences()
  if (!mapLocation) return

  const elLocation = [...document.querySelectorAll('[data-id]')].find((el) => {
    const { id } = el.dataset
    const { lat, lng } = getPlace(id)
    return lat === mapLocation.lat && lng === mapLocation.lng
  })
  if (!elLocation) return

  elLocation.onclick()
}

function onRemovePlace(ev, id) {
  ev.stopPropagation()
  const removedPlace = removePlace(id)
  removeMarker(removedPlace)
  renderPlaces()
}

function onAddPlace({ latLng }) {
  const [lat, lng] = [latLng.lat(), latLng.lng()]
  centerMap(lat, lng)
  setTimeout(() => {
    const place = {
      id: Date.now().toString(),
      lat,
      lng,
      name: prompt('Place name?'),
    }
    console.log(place)
    addPlace(place)
    addMarker(place)
    renderPlaces()
  }, 100)
}

function onCenter() {
  navigator.geolocation.getCurrentPosition(({ coords }) =>
    centerMap(coords.latitude, coords.longitude)
  )
}

function onUpdatePlace(id, newName) {
  updatePlace(id, newName)
}

function onChangeName(ev) {
  if (ev.key === 'Enter') ev.preventDefault()
}

function onSelectPlace(ev, el, id) {
  setLastSelected(id)

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

function centerMap(lat, lng) {
  gMap.map.setCenter(new google.maps.LatLng(lat, lng))
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

function stopPropagation(ev) {
  ev.stopPropagation()
}

function onGetCsv(el) {
  const csvStart = 'data:text/csv;charset=utf-8,'
  const csvHeaders = 'id,lat,lng,name,createdAt\n'
  const csvData = getPlaces()
    .map(
      ({ id, lat, lng, name, createdAt }) =>
        `${id},${lat},${lng},${name},${createdAt}`
    )
    .join('\n')

  console.log(el.href, csvStart + csvHeaders + csvData)

  el.href = csvStart + csvHeaders + csvData
}

function _renderPlace({ id, name, createdAt }) {
  return `
    <article data-id=${id} onclick="onSelectPlace(event,this,'${id}')">
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
