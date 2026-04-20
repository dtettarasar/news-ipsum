import { getVideos } from '~/server/database/site-content'

export default defineEventHandler(async (event) => {
  const limit = parseInt(getQuery(event).limit as string) || 5

  const topVideos = getVideos()
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
    .map(({ _id, title, slug, category, thumbnail, views, duration, author }) => ({
      _id,
      title,
      slug,
      category,
      thumbnail,
      views,
      duration,
      author,
    }))

  return { success: true, data: topVideos }
})
