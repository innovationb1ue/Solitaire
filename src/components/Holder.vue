<template>
  <div class="card holder" draggable="true" style="cursor:pointer;"></div>
</template>
<script>
export default {
  name: "Holder",
  data: function () {
    return {
      isDisplayed: false
    };
  }
};
</script>

<style>
.holder {
  opacity: 0;
}

</style>