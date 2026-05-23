module.exports = {
  pagination: {
    data: "projects",
    size: 1,
    alias: "project",
    before: (projects) => projects.filter((p) => p.active),
  },
  layout: "base.njk",
  eleventyComputed: {
    title: (data) => data.project.title,
    description: (data) => data.project.description,
    permalink: (data) => `/projects/${data.project.slug}/`,
  },
};
