import { createApp } from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import router from "./router/index";
import store from "./store";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { LoadingPlugin } from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import CodeBlock from 'vue3-code-block';
import { createPahoMqttPlugin } from 'vue-paho-mqtt';

const app = createApp(App);
app.use(Antd);
app.use(store);
app.use(router);
app.use(CodeBlock);
app.use(LoadingPlugin);
app.use(createPahoMqttPlugin({
    PluginOptions: {
        autoConnect: true,
        showNotifications: false,
    },

    MqttOptions: {
        host: '192.168.1.123',
        port: 9001,
        useSSL: false,
        clientId: `MyID-${Math.random() * 9999}`,
        enableMainTopic: true,
        reconnectTimeout: 2000,
        mainTopic: 'MAIN',
        username: 'admin',
        password: 'admin'
    },
}))
app.mount("#app");
