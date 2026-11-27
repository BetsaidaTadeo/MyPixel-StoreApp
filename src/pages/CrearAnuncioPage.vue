<template>
  <q-page class="q-pa-md">
    <div style="max-width: 1000px; margin: 0 auto">
      <q-btn flat dense no-caps to="/" class="q-mb-md">
        <q-icon name="arrow_back" color="primary" class="q-mr-xs" />
        <span class="text-body1">Volver</span>
      </q-btn>

      <div class="text-h5 text-weight-bold q-mb-md">Nuevo anuncio</div>

      <q-form @submit="crearAnuncio" @validation-error="alFallarValidacion">
        <!-- Datos generales -->
        <q-card flat bordered class="q-mb-md anuncio-seccion">
          <q-card-section class="row items-center q-pb-none">
            <q-icon name="label" color="primary" size="sm" class="q-mr-sm" />
            <div class="text-subtitle1 text-weight-bold">Datos generales</div>
          </q-card-section>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  v-model="form.titulo"
                  label="Título breve del anuncio"
                  outlined
                  dense
                  maxlength="80"
                  counter
                  :rules="[requerido]"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  :model-value="form.precio"
                  type="text"
                  inputmode="decimal"
                  label="Precio"
                  prefix="$"
                  outlined
                  dense
                  :rules="[precioValido]"
                  @update:model-value="form.precio = limpiarPrecio($event)"
                  @beforeinput="filtrarPrecio"
                />
              </div>
              <div class="col-12 col-sm-6">
                <div class="text-body2 text-grey-8">Estado</div>
                <q-option-group
                  v-model="form.estado"
                  :options="ESTADOS"
                  type="radio"
                  color="primary"
                  inline
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Especificaciones -->
        <q-card flat bordered class="q-mb-md anuncio-seccion">
          <q-card-section class="row items-center q-pb-none">
            <q-icon name="smartphone" color="primary" size="sm" class="q-mr-sm" />
            <div class="text-subtitle1 text-weight-bold">Especificaciones</div>
          </q-card-section>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6 col-md-4">
                <q-select
                  v-model="form.marca"
                  :options="MARCAS"
                  label="Marca"
                  outlined
                  dense
                  :rules="[requerido]"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <q-input v-model="form.modelo" label="Modelo" outlined dense :rules="[requerido]" />
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <q-select
                  v-model="form.sistema"
                  :options="SISTEMAS"
                  label="Sistema"
                  outlined
                  dense
                  :rules="[requerido]"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <q-input
                  v-model="form.pantalla"
                  label="Pantalla (pulgadas)"
                  type="number"
                  step="0.1"
                  min="5"
                  outlined
                  dense
                  :rules="[pantallaValida]"
                  @keydown="bloquearSignos"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <q-select
                  v-model="form.rom"
                  :options="ROMS"
                  label="Rom (almacenamiento)"
                  outlined
                  dense
                  :rules="[requerido]"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <q-select
                  v-model="form.ram"
                  :options="RAMS"
                  label="Ram"
                  outlined
                  dense
                  :rules="[requerido]"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Vendedor -->
        <q-card flat bordered class="q-mb-md anuncio-seccion">
          <q-card-section class="row items-center q-pb-none">
            <q-icon name="person" color="primary" size="sm" class="q-mr-sm" />
            <div class="text-subtitle1 text-weight-bold">Vendedor</div>
          </q-card-section>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.vendedor"
                  label="Vendedor"
                  outlined
                  dense
                  :rules="[requerido]"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="form.telefono"
                  label="Teléfono"
                  mask="####-####"
                  outlined
                  dense
                  :rules="[requerido]"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Descripción -->
        <q-card flat bordered class="q-mb-md anuncio-seccion">
          <q-card-section class="row items-center q-pb-none">
            <q-icon name="notes" color="primary" size="sm" class="q-mr-sm" />
            <div class="text-subtitle1 text-weight-bold">Descripción</div>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="form.descripcion"
              label="Describe el estado, accesorios, compañía, etc."
              type="textarea"
              rows="5"
              outlined
              maxlength="1000"
              counter
              :rules="[requerido]"
            />
          </q-card-section>
        </q-card>

        <!-- Imágenes -->
        <q-card flat bordered class="q-mb-md anuncio-seccion">
          <q-card-section class="row items-center q-pb-none">
            <q-icon name="add_photo_alternate" color="primary" size="sm" class="q-mr-sm" />
            <div class="text-subtitle1 text-weight-bold">Imágenes</div>
            <q-space />
            <span class="text-body2 text-grey-8">{{ fotos.length }} / {{ MAX_FOTOS }}</span>
          </q-card-section>

          <q-card-section>
            <div
              class="zona-fotos column flex-center cursor-pointer"
              :class="{ 'zona-activa': arrastrando }"
              @click="selector.click()"
              @dragover.prevent="arrastrando = true"
              @dragleave.prevent="arrastrando = false"
              @drop.prevent="alSoltar"
            >
              <q-icon name="add_photo_alternate" size="56px" color="primary" />
              <div class="text-subtitle1 text-weight-medium q-mt-sm">
                Haga clic o arrastre tus fotos aquí
              </div>
              <div class="text-body2 text-grey-7">
                Puede elegir varias a la vez. Hasta {{ MAX_FOTOS }} fotos de 5 MB cada una.
              </div>
            </div>
            <input
              ref="selector"
              type="file"
              accept="image/*"
              multiple
              class="hidden"
              @change="alElegir"
            />

            <q-markup-table v-if="fotos.length" flat dense class="q-mt-md">
              <thead>
                <tr class="text-left">
                  <th>N</th>
                  <th>Foto</th>
                  <th>Nombre</th>
                  <th>Tamaño</th>
                  <th>Tipo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(foto, i) in fotos" :key="foto.url">
                  <td>{{ i + 1 }}</td>
                  <td>
                    <q-img
                      :src="foto.url"
                      width="56px"
                      height="56px"
                      fit="cover"
                      class="rounded-borders"
                    />
                  </td>
                  <td>
                    {{ foto.archivo.name }}
                    <q-badge
                      v-if="i === 0"
                      color="secondary"
                      text-color="black"
                      label="Portada"
                      class="q-ml-sm"
                    />
                  </td>
                  <td>{{ formatoTamano(foto.archivo.size) }}</td>
                  <td>{{ foto.archivo.type.split('/')[1] || foto.archivo.type }}</td>
                  <td class="text-right">
                    <q-btn flat round dense size="sm" icon="close" @click="quitarFoto(i)" />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>

            <div v-if="fotos.length" class="row justify-end q-mt-sm">
              <q-btn flat dense no-caps color="grey-8" label="Quitar todas" @click="quitarTodas" />
            </div>
          </q-card-section>
        </q-card>

        <div class="row justify-end q-gutter-sm q-mb-xl">
          <q-btn flat no-caps label="Cancelar" to="/" />
          <q-btn
            unelevated
            no-caps
            color="primary"
            label="Crear anuncio"
            type="submit"
            :loading="guardando"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/boot/firebase'
import { useAnunciosStore } from '@/stores/anuncios'
import { subirImagenes } from '@/utils/couch'
import { ESTADOS, MARCAS, SISTEMAS, ROMS, RAMS, MAX_FOTOS, MAX_BYTES_FOTO } from '@/utils/catalogos'

const $q = useQuasar()
const router = useRouter()
const anuncios = useAnunciosStore()

// Datos del formulario
const form = ref({
  titulo: '',
  precio: '',
  estado: 'nuevo',
  marca: null,
  modelo: '',
  pantalla: null,
  sistema: null,
  rom: null,
  ram: null,
  vendedor: '',
  telefono: '',
  descripcion: '',
})

// Reglas de validación
const requerido = (v) =>
  (v !== null && v !== undefined && String(v).trim() !== '') || 'Campo obligatorio'
const precioValido = (v) =>
  (v !== '' && v !== null && Number(v) > 0) || 'Ingrese un precio mayor a 0'

const pantallaValida = (v) =>
  (v !== '' && v !== null && Number(v) >= 5 && Number(v) <= 10) ||
  'Ingresa un tamaño entre 5 y 10 pulgadas'

function bloquearSignos(e) {
  if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault()
}

//para notificar si se euivocó en un campo:
function alFallarValidacion() {
  $q.notify({
    type: 'negative',
    message: 'Falta un dato o hay uno incorrecto. Revise los campos en rojo.',
    position: 'top',
    timeout: 3000,
  })
}

// Deja solo números y un punto decimal, con máximo 2 decimales (acepta la coma como punto)
function limpiarPrecio(valor) {
  const v = String(valor ?? '')
    .replace(',', '.')
    .replace(/[^0-9.]/g, '')
  const [entero, ...resto] = v.split('.')
  return resto.length ? `${entero}.${resto.join('').slice(0, 2)}` : entero
}

//para que no deje meter letras en el input del precio
// Solo deja escribir números, un punto (o coma) y máximo 2 decimales.
// Revisa cómo quedaría el texto antes de escribirlo, y si no es válido, lo cancela.
function filtrarPrecio(e) {
  if (e.data == null) return // borrar, mover el cursor, etc.
  const campo = e.target
  const resultado =
    campo.value.slice(0, campo.selectionStart) + e.data + campo.value.slice(campo.selectionEnd)
  if (!/^\d*[.,]?\d{0,2}$/.test(resultado)) e.preventDefault()
}

// Fotos: cada una guarda el archivo y una URL temporal para mostrar la miniatura
const fotos = ref([])
const selector = ref(null)
const arrastrando = ref(false)

function agregarArchivos(lista) {
  const nuevos = Array.from(lista)
  const validos = nuevos.filter((f) => f.type.startsWith('image/') && f.size <= MAX_BYTES_FOTO)

  if (validos.length < nuevos.length) {
    $q.notify({ type: 'negative', message: 'Solo se permiten imágenes de hasta 5 MB.' })
  }

  const espacio = MAX_FOTOS - fotos.value.length
  if (validos.length > espacio) {
    $q.notify({ type: 'warning', message: `Máximo ${MAX_FOTOS} fotos por anuncio.` })
  }

  validos.slice(0, Math.max(espacio, 0)).forEach((archivo) => {
    fotos.value.push({ archivo, url: URL.createObjectURL(archivo) })
  })
}

function alElegir(e) {
  agregarArchivos(e.target.files)
  e.target.value = '' // permite volver a elegir el mismo archivo
}

function alSoltar(e) {
  arrastrando.value = false
  agregarArchivos(e.dataTransfer.files)
}

function quitarFoto(indice) {
  URL.revokeObjectURL(fotos.value[indice].url)
  fotos.value.splice(indice, 1)
}

function quitarTodas() {
  fotos.value.forEach((f) => URL.revokeObjectURL(f.url))
  fotos.value = []
}

function formatoTamano(bytes) {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} kb`
}

onBeforeUnmount(quitarTodas)

// Guardar: datos en Firestore, fotos en CouchDB con el mismo ID
const guardando = ref(false)

async function crearAnuncio() {
  if (fotos.value.length === 0) {
    $q.notify({ type: 'negative', message: 'Agrega al menos una foto del celular.' })
    return
  }

  guardando.value = true
  try {
    const docRef = await addDoc(collection(db, 'anuncios'), {
      ...form.value,
      precio: Math.round(Number(form.value.precio) * 100) / 100,
      pantalla: Number(form.value.pantalla).toFixed(1), // '6' -> '6.0', como los anuncios existentes
      totalImagenes: 0,
      fecha: serverTimestamp(),
    })

    try {
      await subirImagenes(
        docRef.id,
        fotos.value.map((f) => f.archivo),
      )
      await updateDoc(docRef, { totalImagenes: fotos.value.length })
    } catch (error) {
      console.error('Error al subir las imágenes:', error)
      $q.notify({
        type: 'warning',
        message: 'El anuncio se creó, pero no se pudieron subir las fotos.',
      })
    }

    $q.notify({ type: 'positive', message: 'Anuncio creado correctamente', timeout: 3000 })
    await anuncios.cargar(true)
    router.push('/')
  } catch (error) {
    console.error('No se pudo crear el anuncio:', error)
    $q.notify({ type: 'negative', message: 'No se pudo crear el anuncio. Intenta de nuevo.' })
  } finally {
    guardando.value = false
  }
}
</script>
