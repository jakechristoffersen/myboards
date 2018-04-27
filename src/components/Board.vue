<template>
  <div class="board">
    <h1>{{board.name}}</h1>
    <div style="outline: 1px solid;" v-for="post in board.posts">
      <div class="post">
        <h1>{{post.name}}</h1>
        <h5>{{post.description}}</h5>
      </div>
    </div>
    <h1></h1>
    <form @submit.prevent="add(post); post = {};">
      <label for="name">Name</label>
      <input type="text" id="name" v-model="post.name">
      <label for="description">Description</label>
      <input type="text" id="description" v-model="post.description">
      <button type="submit">Add Post</button>
    </form>
  </div>
</template>

<script>
  export default {
    name: 'board',
    data() {
      return {
        post: {}
      }
    },
    methods: {
      add(post) {
        this.$store.dispatch('addPost', {boardId: this.$route.params.boardId, post: post})
      },
      remove(boardId) {
        this.$store.dispatch('deletePost', boardId)
      }
    },
    computed: {
      
      board() {
        return this.$store.state.activeBoard
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1,
  h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>