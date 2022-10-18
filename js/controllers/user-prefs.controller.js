'use strict'

function onInit() {}

function onSetPreferences(ev) {
  ev.preventDefault()
  const elForm = ev.target
  const formData = new FormData(elForm)
  const preferences = Object.fromEntries(formData)

  //TODO: change mapLocation -> if keyName turn to latLng obj, if latLng str turn to obj

  setPreferences(preferences)
  elForm.reset()
}
