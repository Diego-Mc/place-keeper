'use strict'

function onInit() {
  const { name } = getPreferences()
  document.querySelector('.username').innerText = name || 'Stranger'
  renderColors()
}
