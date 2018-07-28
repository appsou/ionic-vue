import Vue from 'vue'

let globalVue = null

if (typeof window !== 'undefined') {
  globalVue = window.Vue
} else if (typeof global !== 'undefined') {
  globalVue = global.Vue
} else {
  globalVue = Vue
}

export function attachViewToDom(parentElement, vueComponent, propsData, classes) {
  const wrapper = document.createElement(shouldWrapInIonPage(parentElement) ? 'ion-page' : 'div')

  parentElement.appendChild(wrapper)
  const vueElement = globalVue.extend(vueComponent)
  const page = new vueElement({ propsData }).$mount(wrapper)

  if (classes) {
    for (const cls of classes) {
      page.$el.classList.add(cls)
    }
  }

  return Promise.resolve(page.$el)
}

export function removeViewFromDom(parentElement, childElement) {
  if (childElement.hasOwnProperty('__vue__')) {
    childElement.__vue__.$destroy()
  }

  parentElement.removeChild(childElement)

  return Promise.resolve()
}

const Delegate = {
  attachViewToDom,
  removeViewFromDom,
}

export { Delegate }

function shouldWrapInIonPage(element) {
  return isElementModal(element) || isElementNav(element)
}

function isElementNav(element) {
  return element.tagName.toUpperCase() === 'ION-NAV'
}

function isElementModal(element) {
  return element.classList.contains('modal-wrapper')
}