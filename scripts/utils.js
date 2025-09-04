function getTemplateContent(templateId, content) {
  const template = document.getElementById(templateId)
  const templateContent = template.content.cloneNode(true)
  return templateContent.querySelector(content)
}

function renderElement(tag, parent, attributes = {}) {
  const fragment = document.createDocumentFragment()
  const element = document.createElement(tag)

  Object.keys(attributes).forEach(key => {
    if (key in element) {
      element[key] = attributes[key]
    
    } else {
      element.setAttribute(key, attributes[key])
    }
  })

  fragment.appendChild(element)
  parent.appendChild(fragment)
}

export {
  getTemplateContent,
  renderElement
}
