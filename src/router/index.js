import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import NPprogress from "nprogress";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  NPprogress.start();
  // 在此进行身份校验
  next();
});

router.afterEach(() => {
  NPprogress.done();
  // 修改title
});

export default router;
