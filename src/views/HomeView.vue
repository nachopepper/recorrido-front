<template>
  <app-layout>
    <template #main-content="slotProps">
      <edit-assignations :weeks_params="slotProps.model"/>
    </template>
  </app-layout>
</template>
<script setup>
import AppLayout from '@/components/AppLayout.vue';
import EditAssignations from '@/components/EditAssignations.vue';
</script>