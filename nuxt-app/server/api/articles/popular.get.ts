import { articlesData } from '~/server/database/site-content'

export default defineEventHandler(async (event) => {
  const limit = parseInt(getQuery(event).limit as string) || 12

  const popular = articlesData
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, limit)
    .map(({ _id, title, image, category, likes, readTime, author, slug }) => ({
      _id,
      title,
      image,
      category,
      likes,
      readTime,
      author,
      slug,
    }))

  return { success: true, data: popular }
})