<script setup>
import Swal from 'sweetalert2'
import { defineProps, ref } from 'vue'

const props = defineProps(['acceptMessage'])

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});
Toast.fire({
  icon: "success",
  title: `${props.acceptMessage}`
});
</script>