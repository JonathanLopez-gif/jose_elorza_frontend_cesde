import axios from 'axios'

import { env } from '@/config/env'

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
  withCredentials: true, // el refresh token viaja en una cookie httpOnly
  headers: {
    'Content-Type': 'application/json',
  },
})
