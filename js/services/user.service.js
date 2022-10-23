'use strict'

var gPreferences

const PREF_KEY = 'preferences'

initPreferences()

function initPreferences() {
  gPreferences = loadFromStorage(PREF_KEY)
  if (!gPreferences) {
    gPreferences = {
      name: 'Stranger',
      secondaryColor: '#ffffff',
      primaryColor: '#000000',
      modalBg: '#f7f8f9',
      mapLocation: { lat: 0, lng: 0 },
      zoom: 10,
    }
  }
  saveToStorage(PREF_KEY, gPreferences)
}

function resetPreferences() {
  localStorage.setItem(PREF_KEY, null)
  initPreferences()
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
