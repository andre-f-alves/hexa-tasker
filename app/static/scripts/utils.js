function getTemplateContent(templateId, content) {
  const template = document.getElementById(templateId)
  const templateContent = template.content.cloneNode(true)
  return templateContent.querySelector(content)
}

export { getTemplateContent }
