const AppMenu = Vue.component('app-menu', {
  template: '#app-menu'
});

const AppFooter = Vue.component('app-footer', {
  template: '#app-footer'
});

const Home = Vue.component('Home', {
  template: '#home-tpl'
});

const Logo = Vue.component('Logo', {
  template: '<section>Logo</section>'
});

const Posts = Vue.component('Posts', { 
  template: '#posts-tpl',
  data: function() {
    return {
      posts: [
        {userId: 0, id: 201, title: "Example static first post", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sed tellus rhoncus, molestie tortor posuere, molestie ex."},
        {userId: 0, id: 202, title: "Example static second post", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."},
        {userId: 0, id: 203, title: "Example static third post", body: "Lorem ipsum dolor sit amet"}
      ]
    }
  },
  methods: {
    fetchPlaceholderPosts: function() {
      this.$http.get('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(result => this.posts = result)
    }
  }
});

const Albums = Vue.component('Albums', {
  template: '#albums-tpl',
  data: function() {
    return {
      record: {},
      sortAsc: true,
      query: '',
      columns: ['userId', 'id', 'title'],
      newAlbum: {},
      deleteID: null,
      albums: [],
    }
  },
  computed: {
    filteredAlbums: function() {
      let result = this.albums;
      if (this.query) {
        result = result.filter(item => item.title.includes(this.query));
      }

      let ascDesc = this.sortAsc ? 1 : -1;
      return result.sort((a, b) => ascDesc * a.title.localeCompare(b.title.toString()));
    }
  },
  methods: {
    fetchPlaceholderAlbums: function() {
      this.$http.get('https://jsonplaceholder.typicode.com/albums')
        .then(response => response.json())
        .then(result => this.albums = result)
    },
    addAlbum: function() {
      this.albums.push(this.newAlbum);
      this.newAlbum = {};
    },
    reverseSort: function() {
      this.sortAsc = !this.sortAsc;
    }

  },
  filters: {
    uppercase: function(value) {
      return value.toUpperCase() || "";
    }
  },
  mounted: function() {
      this.fetchPlaceholderAlbums();
  }
});

const Albums2 = Vue.component('Albums2', {
  template: '#albums2-tpl',
  data: function() {
    return {
      albums: [],
      activePage: 1,
      allPages: 0,
      show: 6,
      showFrom: 0,
      get pageItems() {
        return localStorage.getItem('pageItems') || 6;
      },
      set pageItems(value) {
        localStorage.setItem('pageItems', value);
      }
    }
  },
  computed: {
    filteredAlbums: function() {
      var list = this.albums.slice(this.showFrom, this.show);
      this.allPages = Math.ceil(this.albums.length / this.pageItems);
      return list;
    }
  },
  methods: {
    fetchPlaceholderAlbums: function() {
      this.$http.get('https://jsonplaceholder.typicode.com/albums')
        .then(response => response.json())
        .then(result => this.albums = result)
    },
    changeSelect: function(){
      localStorage.setItem('pageItems', this.pageItems);
      this.show = localStorage.getItem('pageItems');
      this.activePage = 1;
      this.showFrom = 0;
    },
    nextPage: function() {
      if (this.activePage != this.allPages){
        this.showFrom = (this.activePage * this.pageItems);
        this.activePage =  this.activePage + 1;
        this.show = (this.activePage * this.pageItems); 
      }   
    },
    previousPage: function() {
      if (this.activePage != 1){
        this.showFrom = ((this.activePage - 2) * this.pageItems) ;
        this.activePage =  this.activePage - 1;
        this.show = (this.activePage * this.pageItems); 
      }   
    },
    thisPage: function(page) {
      this.activePage =  page;
      this.showFrom = ((this.activePage - 1) * this.pageItems);
      this.show = (this.activePage * this.pageItems); 
    }
  },
  mounted: function() {
      this.fetchPlaceholderAlbums();
      if (localStorage.getItem('pageItems'))
        this.show = JSON.parse(localStorage.getItem('pageItems'));
  }
});

const router = new VueRouter({
  routes: [
    { path: '/', name: 'home', component: Home},
    { path: "/posts", name: 'posts', component: Posts },
    { path: "/albums", name: 'albums', component: Albums },
    { path: "/albums2", name: 'albums2', component: Albums2 },
    { path: "/logo", name: 'logo', component: Logo }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/logo') {
    next('/')
  }
  else {
    next()
  }
})

const app = new Vue({
  router,
  el: '#app',
  components: {
    AppMenu, Home, Posts, Albums, Albums2, AppFooter
  }
}).$mount("#app");
