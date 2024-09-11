<template>
  <div id="app">
    <img src="./assets/logo.png">
    <nav>
      <RouterLink to="/">Go to Home1111</RouterLink>
      <RouterLink to="/about">Go to About</RouterLink>
      <RouterLink to="/test">Go to test</RouterLink>

      <el-button type="primary">主要按钮</el-button>
      <el-button type="success">成功按钮</el-button>
    </nav>
    <main>
      <RouterView />
    </main>
    </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
