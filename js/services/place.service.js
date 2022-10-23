var gPlaces
var gLastSelected

const PLACES_KEY = 'places'
const LAST_SELECTED_KEY = 'last-selected'

initPlaces()

function initPlaces() {
  gPlaces = loadFromStorage(PLACES_KEY)
  gLastSelected = loadFromStorage(LAST_SELECTED_KEY)
  if (!gPlaces) {
    gPlaces = [
      {
        id: 123,
        lat: 21.1221,
        lng: 42.54554,
        name: 'Example',
        createdAt: Date.now(),
      },
    ]
  }
  saveToStorage(PLACES_KEY, gPlaces)
  saveToStorage(LAST_SELECTED_KEY, gLastSelected)
}

function addPlace(placeObj) {
  const place = { ...placeObj, createdAt: Date.now() }
  gPlaces.push(place)

  saveToStorage(PLACES_KEY, gPlaces)
  return place
}

function removePlace(id) {
  const placeIdx = gPlaces.findIndex((place) => place.id === id)
  const deleted = gPlaces.splice(placeIdx, 1)

  saveToStorage(PLACES_KEY, gPlaces)

  if (gLastSelected.id === id) {
    gLastSelected = null
    saveToStorage(LAST_SELECTED_KEY, gLastSelected)
  }

  return deleted[0]
}

function updatePlace(id, newName) {
  const place = getPlace(id)
  place.name = newName
  place.createdAt = Date.now()

  saveToStorage(PLACES_KEY, gPlaces)
  return place
}

function setLastSelected(id) {
  gLastSelected = getPlace(id)
  saveToStorage(LAST_SELECTED_KEY, gLastSelected)
}

function getLastSelected() {
  return gLastSelected
}

function getPlace(id) {
  return gPlaces.find((place) => place.id === id)
}

function getPlaces() {
  return gPlaces
}
