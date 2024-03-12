<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div v-if="user.loggedIn">
          <div class="card">
            <h5 class="card-header">Annotation</h5>
            <div class="card-body">
              <div class="form-group row">
                <label for="node-id" class="col-md-4 col-form-label text-md-right">Under Maintenance</label>
              </div>
              <div class="form-group row mb-0 mt-3">
                <div class="col-md-8 offset-md-4">
                  <button @click="sendRequest" class="btn btn-primary">
                    Generate
                  </button>
                  <h4>{{ sampleFlaskResponse }}</h4>
                </div>
              </div>
            </div>
          </div>
          <div class="mx-auto mt-4">
            <button @click.prevent="signOut" class="btn btn-danger">
              Log Out
            </button>
          </div>
        </div>
        <div v-else>
          <div class="alert alert-danger" role="alert">
            You are not logged in!
          </div>
          <div>
            <router-link to="/login">
              <button class="btn btn-primary">Back</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { auth } from "../firebaseConfig";
import axios from "axios";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import jwtDecode from 'jwt-decode';

export default {
  name: "DashboardComponent",

  setup() {
    const store = useStore();
    const router = useRouter();
    const sampleFlaskResponse = ref("");

    auth.onAuthStateChanged((user) => {
      store.dispatch("fetchUser", user);
    });

    const user = computed(() => {
      return store.getters.user;
    });

    const signOut = async () => {
      await store.dispatch("logOut");
      router.push("/login");
    };

    const error = ref(null);

    const isTokenExpired = (token) => {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds and round down
      return decodedToken.exp < currentTime;
    }

    const sendRequest = () => {

      if (!isTokenExpired(store.getters.user.data.accessToken)) {
        axios
          .get("/sample-flask-healthcheck", {
            headers: {
              Authorization: "Bearer " + store.getters.user.data.accessToken
            }
          })
          .then((response) => {
            sampleFlaskResponse.value = response.data;
          })
          .catch(function (err) {
            if (err.message === "Request failed with status code 500") {
              error.value = "Internal Server Error";
              notify();
            }
          });
      }
      else {
        loader.hide();
        signOut();
      }

    };

    const notify = () => {
      toast.error(error.value, {
        autoClose: 5000,
        position: toast.POSITION.BOTTOM_RIGHT,
      }); // ToastOptions
    }

    return { user, signOut, sendRequest, sampleFlaskResponse, error };
  },
};
</script>
