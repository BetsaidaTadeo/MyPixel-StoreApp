import { defineBoot } from '#q-app'
import axios from 'axios'

// Conexión a CouchDB (donde se guardan las imágenes de los anuncios)
const api = axios.create({
  baseURL: 'http://localhost:5984',
})
export { api }

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})
