var gPlaces

const PLACE_KEY = 'places'

initPlaces()

function initPlaces() {
  gPlaces = loadFromStorage(PLACE_KEY)
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
  saveToStorage(PLACE_KEY, gPlaces)
}

function addPlace(placeObj) {
  const place = { ...placeObj, createdAt: Date.now() }
  gPlaces.push(place)

  saveToStorage(PLACE_KEY, gPlaces)
  return place
}

function removePlace(id) {
  const placeIdx = gPlaces.findIndex((place) => place.id === id)
  const deleted = gPlaces.splice(placeIdx, 1)

  saveToStorage(PLACE_KEY, gPlaces)
  return deleted[0]
}

//TODO: add option to change name
function updatePlace(id, newName) {
  const place = getPlace(id)
  place.name = newName
  place.createdAt = Date.now()

  saveToStorage(PLACE_KEY, gPlaces)
  return place
}

function getPlace(id) {
  return gPlaces.find((place) => place.id === id)
}

function getPlaces() {
  return gPlaces
}
