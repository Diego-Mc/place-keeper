'use strict'

var gPreferences

const PREF_KEY = 'preferences'

initPreferences()

function initPreferences() {
  gPreferences = loadFromStorage(PREF_KEY)
  if (!gPreferences) {
    gPreferences = {
      name: 'Stranger',
      bgColor: '#ffffff',
      color: '#000000',
      mapLocation: { lat: 0, lng: 0 },
      zoom: 10,
    }
  }
  saveToStorage(PREF_KEY, gPreferences)
}

function setPreferences(preferences) {
  gPreferences = preferences
  saveToStorage(PREF_KEY, gPreferences)
}

function getPreferences() {
  return gPreferences
}

function getPref(key) {
  return gPreferences[key]
}
