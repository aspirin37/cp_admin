<template>
    <ol class="breadcrumb">
        <li class="breadcrumb-item active">
            <i v-bind:class="icon"></i>
            {{title}}
        </li>
    </ol>
</template>

<script>
export default {
  name: "Breadcrumb",
  props: ["title", "icon"]
}
</script>

