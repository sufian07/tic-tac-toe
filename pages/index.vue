<template>
  <b-container class="bv-example-row">
    <b-row>
      <b-col cols="8">
        <b-row class="header">
          <h1>
            tic-tac-toe
          </h1>
        </b-row>
        <div class="tic-container">
          <b-row>
            <b-col class="tic-cell">1</b-col>
            <b-col class="tic-cell">2</b-col>
            <b-col class="tic-cell">3</b-col>
          </b-row>
          <b-row>
            <b-col class="tic-cell">4</b-col>
            <b-col class="tic-cell">5</b-col>
            <b-col class="tic-cell">6</b-col>
          </b-row>
          <b-row>
            <b-col class="tic-cell">7</b-col>
            <b-col class="tic-cell">8</b-col>
            <b-col class="tic-cell">9</b-col>
          </b-row>
        </div>
      </b-col>
      <b-col cols="4" class="sidebar">
        <b-row class="name-header">
          <h2>{{ name }}</h2>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  created() {
    if (localStorage.name) {
      this.name = localStorage.name;
    } else {
      var name = prompt("Please enter your name", this.makeName());
      localStorage.setItem("name", name);
    }
  },
  methods: {
    makeName: () => {
      var result           = '';
      var characters       = 'abcdefghijklmnopqrstuvwxyz';
      var charactersLength = characters.length;
      result += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(Math.random() * 26));
      for ( var i = 0; i < 5; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
  }
}
</script>

<style>
.header h1,
.name-header h2{
  text-align: center;
  margin: 10px auto;
}
.sidebar {
  background-color: #1e344c;
  color: white;
}
.name-header {
  margin: 10px auto;
  background-color: #35495E;
  margin: 10px auto;
  border-radius: 7PX;
  text-align: center;
}
.name-header h2{

}
.tic-container {
  background-color: #35495E;
  color: white;
}
.tic-container .row{
  margin: 0;
}
.tic-container .tic-cell {
  display: flex;
  padding: 1rem;
  text-align: center;
  align-items: center;
  justify-content: center;
  outline: 1px solid white;
}
</style>
