import { articlesData } from '~/server/database/site-content'

export default defineEventHandler(async (event) => {
  const limit = parseInt(getQuery(event).limit as string) || 12

  const topStories = articlesData
    .sort((a, b) => b.views - a.views)
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

  return { success: true, data: topStories }
})