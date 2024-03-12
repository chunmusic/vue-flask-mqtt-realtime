<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div v-if="user.loggedIn">
          <div class="card">
            <h5 class="card-header">Monitoring System</h5>
            <div class="card-body">
              <div class="row">
                <div class="col-sm-6 mb-3 mb-sm-0">
                  <div class="card text-bg-light mb-3">
                    <div class="card-header h5">Building#1</div>
                    <div class="card-body">
                      <p class="card-text">
                      <ul class="list-unstyled">
                        <li>
                          Temperature: {{ tempBuilding1 }}
                        </li>
                        <li>
                          Humidity: {{ humidBuilding1 }}
                        </li>
                      </ul>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6 mb-3 mb-sm-0">
                  <div class="card text-bg-light mb-3">
                    <div class="card-header h5">Building#2</div>
                    <div class="card-body">
                      <p class="card-text">
                      <ul class="list-unstyled">
                        <li>
                          Temperature: {{ tempBuilding2 }}
                        </li>
                        <li>
                          Humidity: {{ humidBuilding2 }}
                        </li>
                      </ul>
                      </p>
                    </div>
                  </div>
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
import 'status-indicator/styles.css'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import jwtDecode from 'jwt-decode';
import { $mqtt } from 'vue-paho-mqtt'
import { onMounted }  from  "vue";



export default {
  name: "DashboardComponent",

  setup() {
    const store = useStore();
    const router = useRouter();
    const sampleFlaskResponse = ref("");
    const tempBuilding1 = ref("")
    const tempBuilding2 = ref("")
    const humidBuilding1= ref("")
    const humidBuilding2= ref("")

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

    const notify = () => {
      toast.error(error.value, {
        autoClose: 5000,
        position: toast.POSITION.BOTTOM_RIGHT,
      }); // ToastOptions
    }

    onMounted(() => {
      // Connect to the mqtt broker
      $mqtt.connect();

      // Subscribe to a topic
      $mqtt.subscribe("temp/building1", (message) => {
        tempBuilding1.value = message
      });

      $mqtt.subscribe("temp/building2", (message) => {
        tempBuilding2.value = message
      });

      $mqtt.subscribe("humid/building1", (message) => {
        humidBuilding1.value = message
      });

      $mqtt.subscribe("humid/building2", (message) => {
        humidBuilding2.value = message
      });


      // Disconnect from the broker
      $mqtt.disconnect();

    });

    return { user, signOut, sampleFlaskResponse, error, tempBuilding1, tempBuilding2, humidBuilding1, humidBuilding2 };
  },
};
</script>
