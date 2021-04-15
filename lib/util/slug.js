function slugify(s) {
  return s.replace(/\W+/g,"-")
    .replace(/^-|-$/g,"")
    .toLowerCase()
}

module.exports = { slugify }