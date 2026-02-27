import { articlesData } from '~/server/database/site-content'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 6
  const category = query.category as string

  let articles = [...articlesData]
  
  if (category) {
    articles = articles.filter(a => a.category === category)
  }

  const recent = articles
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
    .map(({ _id, title, image, category, views, readTime, author, slug }) => ({
      _id,
      title,
      image,
      category,
      views,
      readTime,
      author,
      slug,
    }))

  return { success: true, data: recent }
})