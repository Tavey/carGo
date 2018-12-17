const session = require("express-session");
const getBaseUrl = () => {
    switch (process.env.ENV) {
        case "development":
            return "http://api.cargo.hb.tst";
        case "production":
            return "http://cha.huabaotech.com/api";
        case "test":
            return "http://cha.test.huabao.io/api";
        default:
            return "http://api.cargo.hb.tst";
    }
};

module.exports = {
    /*
  ** Headers of the page
  */
    head: {
        title: "货在哪儿",
        meta: [
            { charset: "utf-8" },
            {
                name: "viewport",
                content: "width=device-width,initial-scale=1"
            },
            {
                hid: "description",
                name: "description",
                content: "Nuxt.js project"
            }
        ],
        link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico?v2" }],
        script:
            process.env.ENV === "production"
                ? [
                      {
                          src:
                              "https://www.googletagmanager.com/gtag/js?id=UA-118789356-1",
                          async: true
                      },
                      {
                          innerHTML:
                              "window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'UA-118789356-1');"
                      },
                      {
                          src: "http://res.wx.qq.com/open/js/jweixin-1.2.0.js",
                          async: true
                      }
                  ]
                : [
                      {
                          src: "http://res.wx.qq.com/open/js/jweixin-1.2.0.js",
                          async: true
                      }
                  ],
        __dangerouslyDisableSanitizers: ["script"]
    },
    css: [
        "element-ui/lib/theme-chalk/index.css",
        "leaflet/dist/leaflet.css",
        "~assets/global.css",
        "swiper/dist/css/swiper.min.css"
    ],
    /*
  ** Customize the progress bar color
  */
    loading: { color: "#3B8070" },
    /*
  ** Build configuration
  */
    env: {
        baseURL: getBaseUrl()
    },
    build: {
        uglify: {
            uglifyOptions: {
                mangle: { safari10: true }
            }
        },
        /*
    ** Run ESLint on save
    */
        // extend (config, { isDev, isClient }) {
        //   if (isDev && isClient) {
        //     config.module.rules.push({
        //       enforce: 'pre',
        //       test: /\.(js|vue)$/,
        //       loader: 'eslint-loader',
        //       exclude: /(node_modules)/
        //     })
        //   }
        // }
        // extend(config, { isClient }) {
        //     if (!isClient) {
        //         config.externals.splice(0, 0, function(ctx, req, cb) {
        //             if (/hb-map/.test(req)) {
        //                 cb(null, false);
        //             } else {
        //                 cb();
        //             }
        //         });
        //     }
        // },
        vendor: ["axios", "@huabao/map", "leaflet", "element-ui"]
    },
    plugins: [
        { src: "~plugins/element-ui" },
        { src: "~plugins/rules" },
        { src: "~plugins/API/index" },
        { src: "~mixins/directive" },
        { src: "~plugins/indexDB", ssr: false },
        { src: "~plugins/map", ssr: false },
        { src: "~plugins/persistedstate", ssr: false }
    ],
    serverMiddleware: [
        session({
            secret: "super-secret-key",
            cookie: { httpOnly: false },
            resave: false,
            saveUninitialized: true
        })
    ]
};
