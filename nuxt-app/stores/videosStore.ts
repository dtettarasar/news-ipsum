import { defineStore } from 'pinia'
import { ref } from 'vue'

// ===== INTERFACES TYPESCRIPT =====
interface Author {
  name: string
  avatar: string
}

interface Video {

  _id: string
  title: string
  slug: string
  thumbnail: string
  category: string
  views: number
  likes: number
  durationTime: number
  author: Author

}

interface LoadingState {
  topStories: boolean
  recent: boolean
  popular: boolean
}

interface CacheState {
  topStories: boolean
  recent: boolean
  popular: boolean
}