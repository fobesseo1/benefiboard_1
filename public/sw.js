if(!self.define){let e,a={};const c=(c,i)=>(c=new URL(c+".js",i).href,a[c]||new Promise((a=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=a,document.head.appendChild(e)}else e=c,importScripts(c),a()})).then((()=>{let e=a[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(i,s)=>{const f=e||("document"in self?document.currentScript.src:"")||location.href;if(a[f])return;let d={};const t=e=>c(e,f),n={module:{uri:f},exports:d,require:t};a[f]=Promise.all(i.map((e=>n[e]||t(e)))).then((e=>(s(...e),d)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/3d-icons/calend-3d-main.png",revision:"4a481588bb3e8548959ef1200db991fb"},{url:"/3d-icons/cart-3d-main.png",revision:"2e2f251a5422b496fcf77c4ed3488d28"},{url:"/3d-icons/coin-3d-main.png",revision:"dea394867b4ff88e70ec53ca656e909a"},{url:"/3d-icons/cong-3d-main.png",revision:"fd90d6f905dbf581d37bd6c6654ac95f"},{url:"/3d-icons/coupon-3d-main.png",revision:"c430c02a1666c0cfd810b5273668ee8a"},{url:"/3d-icons/folder-3d-main.png",revision:"8f02cc6f38d4848a869f0da163acda2b"},{url:"/3d-icons/gift-3d-main.png",revision:"63ebc2520a05f9f30a453b98f570d565"},{url:"/3d-icons/heart-3d-main.png",revision:"4628f630d1bfc02a47a3726009c44436"},{url:"/3d-icons/lock-3d-main.png",revision:"a64fbca4d5ebbc8ac019c9010c79c405"},{url:"/3d-icons/mike-3d-main.png",revision:"ab17910ad1513e7812a6f2bdf832aa2f"},{url:"/3d-icons/money-3d-main.png",revision:"03ead267442a570b32e26f0fc79b52f2"},{url:"/3d-icons/sticker1.png",revision:"2fd906841b8d92dc0e3c3d4453c98393"},{url:"/3d-icons/sticker2.png",revision:"714f606a6491f467eb09ae5153bc2dff"},{url:"/Logo_of_UNICEF.svg",revision:"5e92d891737b0911330eea23de911b29"},{url:"/_next/app-build-manifest.json",revision:"cfa2f48c403352f96286f68dcb36db7c"},{url:"/_next/static/chunks/1146-c0a9c80c377fa793.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/1336-3c8b267e8c1ceb31.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/1658-4eef8591d29b48af.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/1838.8da4d12d2829e444.js",revision:"8da4d12d2829e444"},{url:"/_next/static/chunks/231-9322099533573040.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/2931-7534667a88406310.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/3195-9d29155e44671d5c.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/370b0802-404f8b9905b52421.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/3994-10ea05699eb2ca11.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/3d47b92a-aeb9a2a3ae6d2907.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/479ba886-57b1640a0c5c2a03.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/4962-56ca88f3bcc2c21a.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/6023-20ac7f7465a2cdd6.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/6542-10c93afc66ba5891.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/6569-f474b146aa1f520e.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/685-21ad1e41c3032a71.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/6963-8a8be9c416746e4a.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/7023-82b86913d0f6a1af.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/7035.cb726032edead13d.js",revision:"cb726032edead13d"},{url:"/_next/static/chunks/7542-01f51ea39de1c835.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/8e1d74a4-ea5f72ba5a797fb8.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/9074-dd0ca9a5e9b001fd.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/9469-dc03ccc5c0d1c1cb.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/9553-12c7b83420883ec7.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/9575-26aaa8fec2d6d9e6.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/9916-2b2cadcf7bee03ce.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/_not-found/page-fde8d0681ec25bcf.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/auth/auth-code-error/page-ab2b72b22cbcf22c.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/auth/confirm/page-a0a8429bb4ddc595.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/auth/page-70fa1882cd42ebd0.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/datafetch/page-f6e50a6a46009052.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/goodbye/page-43d691c698c43a63.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/goodluck/page-a2c38c4de34284a0.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/layout-df8caee80563af8e.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/loading-b1b9b5562cc49ebd.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/message/create/page-1c8b2498eeab26ef.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/message/page-0d7dbbe4238417c9.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/page-f60817369fd19079.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/post/%5BcategoryId%5D/page-ebf14d3f8a1c4255.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/post/best/page-502b0b3b98103f06.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/post/create/page-632a9bd03feff758.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/post/detail/%5Bid%5D/page-dd4fe349111576d6.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/post/edit/%5Bid%5D/page-b1029a4c744192a7.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/post/page-240127d3753b5d66.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/post/search/page-7bfc69657ce5910e.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/profile/%5Bid%5D/page-9b3ecb950d7daec6.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/repost/%5Bid%5D/page-b15817c7eb699f00.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/repost/best/page-83c9b2db6c60d033.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/repost/page-2a83ec2053d31072.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/repost/search/best/page-d7b5861b4b01a29b.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/app/repost/search/page-b67689a72de7a88d.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/fca4dd8b-5ac5db5d283bedc8.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/fd9d1056-fc64169d7c01e985.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/framework-a63c59c368572696.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/main-48b7280641333b50.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/main-app-c48c5d40a95aa271.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/pages/_app-00b74eae5e8dab51.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/pages/_error-c72a1f77a3c0be1b.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-13c59123fd54274c.js",revision:"yAy3qd6W8kh4DjBmYOchT"},{url:"/_next/static/css/6d0fc1792382c4cd.css",revision:"6d0fc1792382c4cd"},{url:"/_next/static/css/a98160a4ee0c3193.css",revision:"a98160a4ee0c3193"},{url:"/_next/static/css/bebfb75f831552bf.css",revision:"bebfb75f831552bf"},{url:"/_next/static/css/c4e39c2ce4d75c33.css",revision:"c4e39c2ce4d75c33"},{url:"/_next/static/media/01dff4c4ac63a0d3-s.woff2",revision:"4253823e253080c6e5e3387173dd2cb0"},{url:"/_next/static/media/0484562807a97172-s.p.woff2",revision:"b550bca8934bd86812d1f5e28c9cc1de"},{url:"/_next/static/media/04daeef78f46eb85-s.woff2",revision:"c11694aa9f35392af7513c295a163bc7"},{url:"/_next/static/media/05a31a2ca4975f99-s.woff2",revision:"f1b44860c66554b91f3b1c81556f73ca"},{url:"/_next/static/media/0639b0dfb9b4f4ba-s.woff2",revision:"9600028749cb1538d1cf50468e5fc016"},{url:"/_next/static/media/06eda078e4b64efd-s.woff2",revision:"2c8a2f6881b8a1071fabae3c6dfeee6a"},{url:"/_next/static/media/07fbd97b4d67da99-s.woff2",revision:"e17e6ecd8dbf872bd11f6f950406ebd7"},{url:"/_next/static/media/0a03a6d30c07af2e-s.woff2",revision:"79da53ebaf3308c806394df4882b343d"},{url:"/_next/static/media/0deff3f0700f03cc-s.woff2",revision:"7909d1a0ab9b6bb9b65faec71a76d34a"},{url:"/_next/static/media/0fef1a063a793ebf-s.woff2",revision:"e2a2a918b52628e6a9056b27e2d218bf"},{url:"/_next/static/media/10b25f7840b4bc42-s.woff2",revision:"aecd7233bcabe32826590ec94d061483"},{url:"/_next/static/media/1589adf678307552-s.woff2",revision:"ad78bee7c72f09cd006c729936e5c654"},{url:"/_next/static/media/171ed914f8915f61-s.woff2",revision:"fc921cd139b0f7438e31ac03e7220d11"},{url:"/_next/static/media/190cde0e85380b12-s.woff2",revision:"dbe7f40a7f9a49f07636c09dab98f0d8"},{url:"/_next/static/media/192dda636ff5febe-s.woff2",revision:"54af29f0d42f26daf30b97063fbf3412"},{url:"/_next/static/media/1af90c063d4c21f1-s.woff2",revision:"36882b48dc0f6f99b291cd17d1e915eb"},{url:"/_next/static/media/1fb58fba2ed52687-s.woff2",revision:"b673d9c4d442684c71a52ace6143d48c"},{url:"/_next/static/media/231f77fab9cf003b-s.woff2",revision:"89b7de729e0e5772c25f70ae7826346f"},{url:"/_next/static/media/23819467d97353aa-s.woff2",revision:"ed25efe8499ccd2d8ae4c73655877ea3"},{url:"/_next/static/media/264ad191907e74e4-s.woff2",revision:"cfce063afc3cbb2d969e6d399bc68a5e"},{url:"/_next/static/media/299c58d589315bf4-s.woff2",revision:"e7df1018686ed0e9832cfc332ad366fd"},{url:"/_next/static/media/2a28c294ba0ddb8d-s.woff2",revision:"9332add8d536b16fcfcda5e65701817f"},{url:"/_next/static/media/2dde13cba929cceb-s.woff2",revision:"0fb5befe47282dd8bde854d73cbd3df6"},{url:"/_next/static/media/2e911975412467c6-s.woff2",revision:"0b2e641770163bfee8b010605b05043a"},{url:"/_next/static/media/2f0c9b3865466e05-s.woff2",revision:"00bb8c0dbaedd4fa18b12a2e730e74d3"},{url:"/_next/static/media/3120dc655b257ccf-s.woff2",revision:"16799712ad877ca35f0baa06ea278ca8"},{url:"/_next/static/media/318ee22ada9a3682-s.woff2",revision:"da21a7a332571cf56059b4be74713783"},{url:"/_next/static/media/36350854f5f459a5-s.woff2",revision:"c90d62831a3b373a22937ec714335e82"},{url:"/_next/static/media/3751b46f0cc8ffc0-s.woff2",revision:"3c4cd13fa2dcd3352a4da43eed2af5f9"},{url:"/_next/static/media/397de44f21f0df04-s.woff2",revision:"d5522d122baa6aaf8aa44aefa3d42a56"},{url:"/_next/static/media/3cc480f26447d3f4-s.woff2",revision:"350c93a99276e50d1b6d568281d4141e"},{url:"/_next/static/media/3cf5232c9acac826-s.woff2",revision:"9671d8596cb3a3d8590bf1da3947b113"},{url:"/_next/static/media/3e83c8b9781da49f-s.woff2",revision:"7302aa16bfef882c238b41468f8c38a9"},{url:"/_next/static/media/3f20ce63bb57fcbe-s.woff2",revision:"4d7e106a509d07bf61cac7183412655d"},{url:"/_next/static/media/4267f749fe0ff01f-s.woff2",revision:"8dac5d0dc35e42a4b932a3c6c072caf6"},{url:"/_next/static/media/42a41d6f90ca27b1-s.woff2",revision:"a6f28de823b53b716d0147021723e825"},{url:"/_next/static/media/435448e75fa5ee63-s.woff2",revision:"5cf994f6fc1b0b8477ccd6643e5abf3e"},{url:"/_next/static/media/46c21389e888bf13-s.woff2",revision:"272930c09ba14c81bb294be1fe18b049"},{url:"/_next/static/media/4867f17d87d5a353-s.woff2",revision:"c70f5549d8d824a94cb7e84613d66aef"},{url:"/_next/static/media/513657b02c5c193f-s.woff2",revision:"c4eb7f37bc4206c901ab08601f21f0f2"},{url:"/_next/static/media/51ed15f9841b9f9d-s.woff2",revision:"bb9d99fb9bbc695be80777ca2c1c2bee"},{url:"/_next/static/media/52aae37d66f9b18b-s.woff2",revision:"54f9253251bf051abfa3bea0e7f98b21"},{url:"/_next/static/media/533328ec97ab7470-s.woff2",revision:"9cf4221b978348813fff71c1def65918"},{url:"/_next/static/media/5362087f295c19ad-s.woff2",revision:"34cfa265c930be4e16b2f4fb61c30a51"},{url:"/_next/static/media/549188ce5b0213e0-s.woff2",revision:"752bd89956b13cb0f0891b15e98abbe3"},{url:"/_next/static/media/5a6c334e80fffaf8-s.woff2",revision:"7e12f8c84977dee8c79a78b4da54780d"},{url:"/_next/static/media/5f38b0ba98bac2ba-s.woff2",revision:"50c6abc679e44a0572a72c264fff96ac"},{url:"/_next/static/media/60bca3914338dd03-s.woff2",revision:"312d64447adf168e47fb28714858359b"},{url:"/_next/static/media/62a35b1059471fc5-s.woff2",revision:"7b5076724c7275b1c566854135b9f314"},{url:"/_next/static/media/6331f0071f2f74e3-s.woff2",revision:"290009c0bf919032d358095bb344c80c"},{url:"/_next/static/media/685416660c3bee4f-s.woff2",revision:"6a291b934fdd83aa924fda208ab20b1d"},{url:"/_next/static/media/694d2933e1c713ce-s.woff2",revision:"ba7c07ab6cd20e0c99a9fce952aec68a"},{url:"/_next/static/media/6ad7d62b0f7d63e4-s.woff2",revision:"fe10334546bcb1793471281348fc3c76"},{url:"/_next/static/media/6dae081418abfe5c-s.woff2",revision:"0d8799e158eaeeb1fe2d3d6a11a76fb1"},{url:"/_next/static/media/70764ebfc7208e24-s.woff2",revision:"49c06fba3cd0639fdb816f916a44590c"},{url:"/_next/static/media/71494b83ddc040bf-s.woff2",revision:"102a9214de488d7d1b164c1c373f3173"},{url:"/_next/static/media/7280640b557fde6e-s.woff2",revision:"baf670e3fe6560817d76e09b4203a60b"},{url:"/_next/static/media/76742baf8508dabc-s.woff2",revision:"0c240b19c2152d486785dc88432fcd42"},{url:"/_next/static/media/77ea56196ff8ff63-s.woff2",revision:"aecd7e10da92c045e68c42f3b6f8a4bd"},{url:"/_next/static/media/784ccdfee4132171-s.woff2",revision:"1b13d1b9e634c285de131aa4ca5bc319"},{url:"/_next/static/media/7915bf8d07af2be8-s.woff2",revision:"04e75799354be28a40f8310f93c3e2d6"},{url:"/_next/static/media/7a3e742a14a198c6-s.woff2",revision:"73e3e1b6e1d6b2467ef47e720a6952a7"},{url:"/_next/static/media/7db6c35d839a711c-s.p.woff2",revision:"de2b6fe4e663c0669007e5b501c2026b"},{url:"/_next/static/media/7dc855ce711afbdf-s.woff2",revision:"c83100e375d6da735fa6a67841ac3de9"},{url:"/_next/static/media/810a12ab927d6ddf-s.woff2",revision:"f8812bdc4d37ea390552e4f1539d315f"},{url:"/_next/static/media/8307bb9269b9d5f5-s.woff2",revision:"b4b193a20aaeaa5c49a52057e2117991"},{url:"/_next/static/media/8356bc88c9aceb8c-s.woff2",revision:"f42d36a42e8482a90aca3b127b8ad5ad"},{url:"/_next/static/media/83febaafa344ce92-s.woff2",revision:"4c20b50eb0997b4d9151b2f0ed47a56b"},{url:"/_next/static/media/859a0dca9e0c6ce2-s.woff2",revision:"85bd2fdb4818301ee7e95dee4a7b3810"},{url:"/_next/static/media/870cdc01bb73440a-s.woff2",revision:"8c4bedb8e336f2baf4dad2cfb7088a58"},{url:"/_next/static/media/87e36b9f82dba8bb-s.woff2",revision:"054ff022400ab739db96c3c27843a909"},{url:"/_next/static/media/893138dcb91f6663-s.woff2",revision:"6320026e4456a21c07f8a17705106076"},{url:"/_next/static/media/89ab80d3cd33729f-s.woff2",revision:"6c79f9e5a7e1adc456af4d69078688b9"},{url:"/_next/static/media/8d0031a6efb26892-s.woff2",revision:"6ecbf2f959ea5b9322b2cc3d00a6ed93"},{url:"/_next/static/media/915abe235506c32b-s.woff2",revision:"ef93453be99f9f0d7f68266cb5e8c880"},{url:"/_next/static/media/92fd8d7711d4e44f-s.woff2",revision:"2fef9d9a4f1bcf1ea6d1b9441626af99"},{url:"/_next/static/media/938473a671f41906-s.woff2",revision:"3fed72d8f2c12e6393cd86cc9d0842f7"},{url:"/_next/static/media/96ff03a0d37ca0cc-s.woff2",revision:"7c809f6a3ff8645bcaeb20e11ea42247"},{url:"/_next/static/media/9a1f7ba304aeeecf-s.woff2",revision:"7aec3edf1326878b1674bcb93dd4a483"},{url:"/_next/static/media/9afba82686c22962-s.woff2",revision:"057eaf74fdb721cc4b9f9d53147c628c"},{url:"/_next/static/media/9c10920ae9aa448b-s.woff2",revision:"cb96560d8287031c7bd1e78fec38e55c"},{url:"/_next/static/media/9dfbb05d946afcd6-s.woff2",revision:"289314d0b294f4fdf8f9c6a87a0152d5"},{url:"/_next/static/media/9fbec714bdb25d9c-s.woff2",revision:"3f0d1658a97c6d8a5b028866f4cab627"},{url:"/_next/static/media/a0ade0cbbb99f32c-s.woff2",revision:"933552228444e96f4badbaedba693195"},{url:"/_next/static/media/a15f2fce4b98b461-s.p.woff2",revision:"3f0d038cee19fede70f342b6fdf2ef9a"},{url:"/_next/static/media/a621347f664b2a4d-s.woff2",revision:"75a20e9e0de33b664d1f72157f4e4660"},{url:"/_next/static/media/a78bba587d6a308c-s.woff2",revision:"853daac0ebb2ef205ae0dd8b48e566c5"},{url:"/_next/static/media/aa40919727fba93d-s.woff2",revision:"144cc1fe7045a7e3a1c644c9319bd292"},{url:"/_next/static/media/aa70556e250acb94-s.woff2",revision:"3465ee57a0f68cc9931b99a5afc9445d"},{url:"/_next/static/media/aa7db2ad41bd25ba-s.woff2",revision:"0f044695cec44ab72605c2751344c05d"},{url:"/_next/static/media/accb5b304442de50-s.woff2",revision:"912db6004cd71579283aff90418232a7"},{url:"/_next/static/media/ae696edaac47af9c-s.woff2",revision:"3ab29966cd55d0fa15f94560fd4b6831"},{url:"/_next/static/media/b02bac4e4cf559dc-s.woff2",revision:"15cec44fb754939fc5c0dfb013cfc9ee"},{url:"/_next/static/media/b0b84cae34b4bea2-s.woff2",revision:"75276d9247c4e43ee0581303388688af"},{url:"/_next/static/media/b2f0ba1cb1abb8d4-s.woff2",revision:"cc57580f80c430ec1aa7b10c3f0ff292"},{url:"/_next/static/media/b3781132b3be7073-s.woff2",revision:"0fdf9f981eccb8b587435ce8716c6fa1"},{url:"/_next/static/media/b485136457214f4b-s.woff2",revision:"58f4a58e1cb5b5ce86cfd87b7e0dff2f"},{url:"/_next/static/media/b737e516a2777308-s.woff2",revision:"d00bab6eb12013a51febfaad3d58861d"},{url:"/_next/static/media/b84676a33e32a8e0-s.woff2",revision:"55f0826e2b89ecf2bf59cb7b5c437dfd"},{url:"/_next/static/media/b90f702fec14e0c6-s.woff2",revision:"77b0cf4739ee982e200276098e2f2da2"},{url:"/_next/static/media/b9f11b1a528ed956-s.woff2",revision:"064ea53272683f26ee6ac0d88b0b0593"},{url:"/_next/static/media/ba003e23a28450e7-s.woff2",revision:"a949cce22621d0167d579a66c57e39e5"},{url:"/_next/static/media/bc726254f52404d2-s.woff2",revision:"2c6fe6b33528a651273af446fd22fd64"},{url:"/_next/static/media/c5e14d45967bbb5e-s.woff2",revision:"59d649b59d66e9f62ffff666e66f87c1"},{url:"/_next/static/media/c6a0b5670846dd2a-s.woff2",revision:"5f201603c49f13023dd6db3dd49ebf68"},{url:"/_next/static/media/c7b0e98f802564b1-s.woff2",revision:"4bb2f1169dc3a1f8668f735b739556d6"},{url:"/_next/static/media/c89ab73a8890fbed-s.woff2",revision:"18df29aab1148c6950afda9b0637c372"},{url:"/_next/static/media/c970d8e7b7fb9a06-s.woff2",revision:"fb73e76d8a557beb66a6d505da3db22c"},{url:"/_next/static/media/c9a5bc6a7c948fb0-s.p.woff2",revision:"74c3556b9dad12fb76f84af53ba69410"},{url:"/_next/static/media/cc5d58d5ea94fcc4-s.woff2",revision:"a193ca92ce492d08089777c3479a361e"},{url:"/_next/static/media/cd769f5a1ca2d9c5-s.woff2",revision:"3506cae512ac8790a3df9dd8532c9017"},{url:"/_next/static/media/cf70e2a08f1f5f62-s.woff2",revision:"cfaad1817c13b671d589202d93a99794"},{url:"/_next/static/media/d0a0342ed691a7f5-s.woff2",revision:"17b4d3d80943f8e66bdd57997feee93e"},{url:"/_next/static/media/d2621c18918d28b8-s.woff2",revision:"bf4f0bda7c5a122906d6fd8f649b847f"},{url:"/_next/static/media/d3310f2e2e8765f6-s.woff2",revision:"1ba88f2b984d7b68501db0fcb3955bce"},{url:"/_next/static/media/d6b16ce4a6175f26-s.woff2",revision:"dd930bafc6297347be3213f22cc53d3e"},{url:"/_next/static/media/da99ae30fc536f3e-s.woff2",revision:"0f3a7d69d9691b1f21395e4328ecd214"},{url:"/_next/static/media/dc5da0fdb1198adf-s.woff2",revision:"06b434d326269209bfb7ef8ca86f7847"},{url:"/_next/static/media/ddb9467c20b2b7b6-s.woff2",revision:"14b27e0b64250a87d7485b533f5f2237"},{url:"/_next/static/media/de1e43093eb6402c-s.woff2",revision:"15e96601a4a7e5e418e906b6e669496a"},{url:"/_next/static/media/dfa2ccbeca9e77a8-s.woff2",revision:"4d88c8f550833714f8721257780b9000"},{url:"/_next/static/media/e0bde08f1e7fbc72-s.woff2",revision:"ae55304bf8c95c4a2db81defdaf650c7"},{url:"/_next/static/media/e44859446483d1d3-s.woff2",revision:"e8baf93f42898b588584b0fccc63a8dd"},{url:"/_next/static/media/e8ac59c94b6ffc73-s.woff2",revision:"ffc900bf02d8b856bd545eddb8d33418"},{url:"/_next/static/media/e8e0bbb6d4247975-s.woff2",revision:"bbdee6382dea249ab8f9a861561a1b54"},{url:"/_next/static/media/eafabf029ad39a43-s.p.woff2",revision:"43751174b6b810eb169101a20d8c26f8"},{url:"/_next/static/media/eba57749f42875c2-s.woff2",revision:"c48222af62c238b5a7d42141c74ab366"},{url:"/_next/static/media/ec159349637c90ad-s.woff2",revision:"0e89df9522084290e01e4127495fae99"},{url:"/_next/static/media/ee5a0461435f8e6c-s.woff2",revision:"ae9605f310b3ff6be24d3d50fba3d7aa"},{url:"/_next/static/media/efd3c9f7dc8b4500-s.woff2",revision:"23561bd2c1f58775df95f3de52123296"},{url:"/_next/static/media/f0e13183b93fe06c-s.woff2",revision:"1f9db9645be0de8a5de0eceda8aeb414"},{url:"/_next/static/media/f14d9587d346a399-s.woff2",revision:"1504045a563478666e0196e921ba03f3"},{url:"/_next/static/media/f238ce09368a915e-s.woff2",revision:"601037b19f77b31208cf7b6155582ab7"},{url:"/_next/static/media/f82c48d71abb058e-s.woff2",revision:"f44458c1b67d9d6cfb680b4f2a84b177"},{url:"/_next/static/media/fa2619592b6250cb-s.woff2",revision:"0b3c080ca3ccfdc1f7b5e7fd8abe65c5"},{url:"/_next/static/media/fbf4122f4eb4fa62-s.woff2",revision:"b7b63732caf95e3db07ef6229ca79f5c"},{url:"/_next/static/media/fd4db3eb5472fc27-s.woff2",revision:"71f3fcaf22131c3368d9ec28ef839831"},{url:"/_next/static/yAy3qd6W8kh4DjBmYOchT/_buildManifest.js",revision:"b222cbf4d8e1f47e27a8925222733e53"},{url:"/_next/static/yAy3qd6W8kh4DjBmYOchT/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/ad-nike1.jpg",revision:"fa1de5e99b4cf43edc12184719169510"},{url:"/ad-sample.jpg",revision:"8f3f7b6e5c7a78bba758c97e7c310346"},{url:"/ad/ad-updown.jpg",revision:"3d98f828eb894398efb5e7cbe77565a4"},{url:"/adBottom-unicef.jpg",revision:"683f41889331d7c86357a7fd0b9a2c96"},{url:"/communityEventsAd.jpg",revision:"08d4b886045de47f807e01cf17dcfd9c"},{url:"/dolphin-black.svg",revision:"0da8b7ef5584a56682483f8ef9b52c57"},{url:"/dolphin.webp",revision:"2d921693954d8717913a1b84e381d57f"},{url:"/logo-benefiboard-white.svg",revision:"d7ec793a43cc12a93a344790d10284ac"},{url:"/logo-benefiboard.svg",revision:"5f0bffca3045d3f66700cac274e20eb7"},{url:"/logo-square.svg",revision:"033f67270cb67b20d3606534a7def91e"},{url:"/lotteryAd.png",revision:"3bbcd36cc5407be22465d0ca0fabb6b2"},{url:"/mainPopupIcons/donation_icon.svg",revision:"8ceae0b7619d07c619b7f6e29f4c4bcc"},{url:"/mainPopupIcons/share50_icon.svg",revision:"62ad8b52415a5e16f724b44afca988b1"},{url:"/mainPopupIcons/smartview_icon.svg",revision:"385848db75d648a721f0d66c0226481e"},{url:"/mainad-1.webp",revision:"e3fc0dcfddbafbf730beecaad384121d"},{url:"/manifest.json",revision:"e65bfe490a65318308d2249ec871213d"},{url:"/medal/bronze-child.svg",revision:"e19ad5376db0d43c618560a9581562f3"},{url:"/medal/bronze-env.svg",revision:"a931e70ab392a6df7f22c47e78f79de8"},{url:"/medal/bronze-senior.svg",revision:"a80fc79e6ed0502dfee43af6af59c8c5"},{url:"/medal/bronze-tree.svg",revision:"30af16e940cbf222da15a22045337809"},{url:"/medal/gold-child.svg",revision:"e55751dffee7845f1f5ab29522d21807"},{url:"/medal/gold-env.svg",revision:"c7551d6a497c488c9124d7deacfbd908"},{url:"/medal/gold-senior.svg",revision:"9551b9e70b74c6798ba1306359fd4195"},{url:"/medal/gold-tree.svg",revision:"e73a204c36ebb77d413e526c72969880"},{url:"/medal/silver-child.svg",revision:"801f6c89e153be58488d700f8eed3f97"},{url:"/medal/silver-env.svg",revision:"fe1aa3fb256bed1403e52a332d9c2e84"},{url:"/medal/silver-senior.svg",revision:"fdb425253dc59ffa0810a830a7e64ace"},{url:"/medal/silver-tree.svg",revision:"fae9ea0ce1ade9541ba98d3ad3bd9d26"},{url:"/money-3d-main.png",revision:"03ead267442a570b32e26f0fc79b52f2"},{url:"/sticker/boy.webp",revision:"33e46f2fa7f877a1d923dc29fe516913"},{url:"/sticker/bulldog.webp",revision:"90dda31dcbbcb7336e96a23826f18307"},{url:"/sticker/dolphin.webp",revision:"2d921693954d8717913a1b84e381d57f"},{url:"/sticker/fireman.webp",revision:"d9b775cf3b9cfa1b4580e61945be8eae"},{url:"/sticker/girl.webp",revision:"8a7fcd0b7ff5aa515ac16fa3a376459c"},{url:"/sticker/grandfather.webp",revision:"3c9d0088e73c39326b8f9123ab177270"},{url:"/sticker/grandmother.webp",revision:"0267ab877518da8cf16bfabddd18dd7b"},{url:"/sticker/hunter.webp",revision:"6a17dc266e4599f708c8a04325e97004"},{url:"/sticker/panda.webp",revision:"59051844bb347dcd70b4b8d14bcf48a0"},{url:"/sticker/small-panda.webp",revision:"320b6a26a28b69d3c3bcbf6c4fbf9cbe"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:a,event:c,state:i})=>a&&"opaqueredirect"===a.type?new Response(a.body,{status:200,statusText:"OK",headers:a.headers}):a}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const a=e.pathname;return!a.startsWith("/api/auth/")&&!!a.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
