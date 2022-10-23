'use strict'

const COORDS_REGEX = /^(?<lat>\d{1,2}(\.\d+)*),(?<lng>\d{1,2}(\.\d+)*)$/

function onInit() {
  renderColors()
  _updatePrevOptions()
}

function setCssVariable(key, value) {
  document.documentElement.style.setProperty(key, value)
}

function renderColors() {
  const { primaryColor, secondaryColor, modalBg } = getPreferences()

  setCssVariable('--primary', primaryColor)
  setCssVariable('--secondary', secondaryColor)
  setCssVariable('--modal-bg', modalBg)
  setCssVariable('--modal-unselected', modalBg + '55')
  setCssVariable('--primary-opacity', primaryColor + 'ef')
  setCssVariable('--primary-more-opacity', primaryColor + 'dd')
}

function onSetPreferences(ev) {
  ev.preventDefault()
  const elForm = ev.target
  const formData = new FormData(elForm)
  const preferences = Object.fromEntries(formData)

  preferences.zoom = +preferences.zoom

  const { mapLocation } = preferences
  let location
  switch (mapLocation) {
    case 'Current location':
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude: lat, longitude: lng } = coords
        preferences.mapLocation = { lat, lng }
        _updatePreferences(preferences, elForm)
      })
      return
    case 'First saved location':
      const firstSaved = getPlaces()[0]
      if (!firstSaved) {
        return _alertMapStart('No saved places.', true)
      }
      location = _getLatLng(firstSaved)
      break
    case 'Random saved location':
      const places = getPlaces()
      if (places.length === 0) {
        return _alertMapStart('No saved places.', true)
      }
      const randIdx = getRandomInt(0, places.length)
      location = _getLatLng(places[randIdx])
      break
    case 'Last selected saved location':
      const lastSelected = getLastSelected()
      if (!lastSelected) {
        return _alertMapStart('No last selected place.', true)
      }
      location = _getLatLng(lastSelected)
      break
    default:
      if (!mapLocation) break

      location = _getLatLng(mapLocation.match(COORDS_REGEX).groups)
  }

  preferences.mapLocation = location
  console.log(location)
  _updatePreferences(preferences, elForm)
}

function onMapLocationInput(val) {
  const elOptions = [...document.querySelectorAll('#locations option')]
  const options = elOptions.map((el) => el.value)
  const isInvalid =
    val !== '' && !(options.includes(val) || COORDS_REGEX.test(val))
  _alertMapStart(
    'Invalid input. Enter a selected state or enter coords for starting location.',
    isInvalid
  )
}

function onResetPreferences() {
  resetPreferences()
  renderColors()
  _updatePrevOptions()
}

function _updatePrevOptions() {
  const prefs = getPreferences()
  ;['primaryColor', 'secondaryColor', 'modalBg', 'name', 'zoom'].forEach(
    (key) => (document.querySelector(`[name=${key}]`).value = prefs[key])
  )
}

function _alertMapStart(msg, isInvalid) {
  const elInvalidMsg = document.querySelector('[name=mapLocation] + small')
  const elInvalidInput = document.querySelector('[name=mapLocation]')

  elInvalidInput.classList.toggle('invalid', isInvalid)
  elInvalidMsg.innerText = isInvalid
    ? msg
    : 'Enter a selected state or enter coords for starting location.'
  elInvalidMsg.classList.toggle('invalid-msg', isInvalid)

  document.querySelector('[type=submit]').disabled = isInvalid
}

function _getLatLng({ lat, lng }) {
  ;[lat, lng] = [+lat, +lng]
  return { lat, lng }
}

function _updatePreferences(preferences, elForm) {
  setPreferences(preferences)
  elForm.reset()
  renderColors()
  _updatePrevOptions()
}
