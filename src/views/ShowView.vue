<template>
  <app-layout>
    <template #main-content="slotProps">
      <show-assignations :weeks_params="slotProps.model"/>
    </template>
  </app-layout>
</template>
<script setup>
import AppLayout from '@/components/AppLayout.vue';
import ShowAssignations from '@/components/ShowAssignations.vue';
</script>