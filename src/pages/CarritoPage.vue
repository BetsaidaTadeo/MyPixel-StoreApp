<template>
  <q-page class="q-pa-md">
    <div style="max-width: 1000px; margin: 0 auto">
      <div class="text-h5 text-weight-bold q-mb-md">Carrito</div>

      <!-- Carrito vacío -->
      <div v-if="!carrito.items.length" class="text-center text-grey-7 q-my-xl">
        <q-icon name="remove_shopping_cart" size="64px" />
        <div class="text-h6 q-mt-md">Su carrito está vacío</div>
        <div class="q-mb-md">Agregue celulares desde el listado para verlos aquí.</div>
        <q-btn unelevated no-caps color="primary" label="Ver celulares" to="/" />
      </div>

      <div v-else class="row q-col-gutter-lg">
        <!-- Productos -->
        <div class="col-12 col-md-8">
          <q-card v-for="item in carrito.items" :key="item.id" flat bordered class="q-mb-md overflow-hidden"
            style="border-radius: 12px">
            <q-card-section horizontal>

              <router-link :to="`/anuncio/${item.id}`" class="carrito-miniatura">
                <FotoCelular :src="item.imagen" class="fit" style="min-height: inherit" />
              </router-link>

              <q-card-section class="col">
                <div class="text-caption text-grey-8">{{ item.marca }}</div>
                <router-link :to="`/anuncio/${item.id}`" class="text-subtitle1 carrito-titulo">
                  {{ item.titulo }}
                </router-link>
                <div>
                  <q-badge color="secondary" text-color="black" :label="item.estado === 'nuevo' ? 'Nuevo' : 'Usado'" />
                </div>

                <!-- Cantidad -->
                <div class="row items-center no-wrap q-mt-sm" style="gap: 4px">
                  <q-btn round dense outline size="sm" color="primary" icon="remove" aria-label="Quitar una unidad"
                    :disable="item.cantidad <= 1" @click="carrito.cambiarCantidad(item.id, -1)" />
                  <span class="text-subtitle1 text-weight-medium text-center" style="min-width: 32px">
                    {{ item.cantidad }}
                  </span>
                  <q-btn round dense outline size="sm" color="primary" icon="add" aria-label="Agregar una unidad"
                    :disable="item.cantidad >= MAX_UNIDADES" @click="carrito.cambiarCantidad(item.id, 1)" />
                </div>
              </q-card-section>

              <q-card-section class="column items-end justify-between">
                <div class="text-right">
                  <div class="text-h6 text-weight-bold">
                    ${{ (item.precio * item.cantidad).toFixed(2) }}
                  </div>
                  <div v-if="item.cantidad > 1" class="text-caption text-grey-7">
                    ${{ item.precio.toFixed(2) }} c/u
                  </div>
                </div>
                <q-btn flat dense no-caps color="negative" icon="delete_outline" label="Quitar"
                  @click="carrito.quitar(item.id)" />
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>

        <!-- Resumen -->
        <div class="col-12 col-md-4">
          <q-card flat bordered style="border-radius: 12px">
            <q-card-section class="bg-secondary text-black text-h6 text-weight-bold">
              Resumen
            </q-card-section>

            <q-card-section>
              <div class="row justify-between q-mb-sm">
                <span>Artículos</span>
                <span class="text-weight-medium">{{ carrito.cantidad }}</span>
              </div>
              <q-separator class="q-my-md" />
              <div class="row justify-between items-center">
                <span class="text-subtitle1">Total</span>
                <span class="text-h5 text-weight-bold">${{ carrito.total.toFixed(2) }}</span>
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-btn unelevated no-caps size="lg" color="positive" text-color="white" label="Finalizar compra"
                class="full-width" @click="finalizar" />
              <q-btn flat no-caps color="grey-8" label="Vaciar carrito" class="full-width q-mt-sm"
                @click="carrito.vaciar()" />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useCarritoStore, MAX_UNIDADES } from '@/stores/carrito'
import FotoCelular from '@/components/FotoCelular.vue'

const $q = useQuasar()
const router = useRouter()
const carrito = useCarritoStore()

function finalizar() {
  carrito.vaciar()
  $q.notify({ type: 'positive', message: 'Compra realizada. ¡Gracias!', timeout: 3000 })
  router.push('/')
}
</script>
