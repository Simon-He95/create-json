<script setup lang="ts">
import { MenuItem, SimpleMenu } from '@strapi/design-system/SimpleMenu'
import { Button } from '@strapi/design-system/Button'
const editLayoutRemainingFields = []
</script>

<template>
  <div>
    <SimpleMenu id="label" :as="Button" data-testid="add-field" full-width variant="secondary">
      <template v-for="field in editLayoutRemainingFields" :key="field">
        <MenuItem on-click="() => onAddField(field)">
          {{ field }}
        </MenuItem>
      </template>
    </SimpleMenu>
  </div>
</template>
