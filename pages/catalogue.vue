<script setup lang="ts">

</script>

<template>
  <div class="max-w-sm">
    <SharedSelect>
      <SharedSelectTrigger>
        <SharedSelectValue placeholder="Select a fruit" />
      </SharedSelectTrigger>
      <SharedSelectContent>
        <SharedSelectGroup>
          <SharedSelectLabel>Fruits</SharedSelectLabel>
          <SharedSelectItem value="apple">
            Apple
          </SharedSelectItem>
          <SharedSelectItem value="banana">
            Banana
          </SharedSelectItem>
        </SharedSelectGroup>
      </SharedSelectContent>
    </SharedSelect>
  </div>
</template>
