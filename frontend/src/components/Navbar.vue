<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark"
    style="background-color: #35495e"
  >
    <div class="container-fluid">
      <span class="navbar-brand fw-bold">Web Monitoring</span>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item py-2">
            <router-link
              style="text-decoration: none; color: white; margin-left: 20px"
              to="monitoring"
            >
              Monitoring</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  setup() {},
};
</script>
