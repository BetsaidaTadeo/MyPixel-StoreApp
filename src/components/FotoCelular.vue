<template>
  <!-- Muestra la foto del celular. Si no hay foto, o no carga, muestra la imagen por defecto -->
  <q-img :src="fuente" fit="contain" class="bg-white" @error="fallo = true" />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import sinImagen from '@/assets/sin-imagen.jpg'

const props = defineProps({
  src: { type: String, default: null },
})

const fallo = ref(false)

// Si cambia la foto, se intenta cargar de nuevo
watch(
  () => props.src,
  () => {
    fallo.value = false
  },
)

const fuente = computed(() => (!props.src || fallo.value ? sinImagen : props.src))
</script>
