import { ref } from 'vue'

const status = ref('')

function setStatus(newStatus: string) {
  status.value = newStatus
}
