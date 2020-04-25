<template>
  <b-container fluid class="bv-example-row">
    <b-row>
      <b-col cols="12">
        <b-row class="header">
          <h1>
            Tic Tac Toe
          </h1>
          <b-button-group>
            <b-button
              v-if="challange"
              @click="resign"
              variant="warning">Resign</b-button>
            <b-button
              v-if="name"
              @click="signOut"
              variant="danger">Sign Out</b-button>
          </b-button-group>
        </b-row>
        <div v-if="name">
          <b-row v-if="challange">
            <b-col cols="2"></b-col>
            <b-col cols="8">
              <b-row>
                <div class="tic-container">
                    <b-col cols="4" class="tic-cell">1</b-col>
                    <b-col cols="4" class="tic-cell">2</b-col>
                    <b-col cols="4" class="tic-cell">3</b-col>
                    <b-col cols="4" class="tic-cell">4</b-col>
                    <b-col cols="4" class="tic-cell">5</b-col>
                    <b-col cols="4" class="tic-cell">6</b-col>
                    <b-col cols="4" class="tic-cell">7</b-col>
                    <b-col cols="4" class="tic-cell">8</b-col>
                    <b-col cols="4" class="tic-cell">9</b-col>
                </div>
              </b-row>
              <b-row class="user-container">
                <b-col class="user own">
                  <p></p>
                  <p><b>Name:</b> {{ name }}</p>
                  <p><b>Chance to win:</b> {{ odd }}%</p>
                </b-col>
                <b-col class="user other">4</b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row v-else>
            <b-button
              class="middle"
              @click="startChallange"
              variant="success">Start Challange</b-button>
          </b-row>
        </div>
        <div v-else>
          <div class="flex-middle">
            <b-form @submit="addName" inline>
              <b-input-group prepend="@" class="mb-2 mr-sm-2 mb-sm-0">
                <b-input
                  id="inline-form-input-username"
                  v-model="form.name"
                  placeholder="Enter Name"></b-input>
              </b-input-group>
              <b-button type="submit" variant="primary">Add</b-button>
            </b-form>
          </div>
        </div>
      </b-col>
      <!-- <b-col cols="4" class="sidebar">
        <b-row class="name-header">
          <h2>{{ name }}</h2>
        </b-row>
        <b-row class="user-list-con">
          <h4>Online Users</h4>
          <ul class="user-list">
            <li v-for="user in users" :key="user.userName">
              {{ user.userName }}
            </li>
          </ul>
        </b-row>
      </b-col> -->
    </b-row>
  </b-container>
</template>

<script>
import Logo from '~/components/Logo.vue'
import socket from '~/plugins/socket.io.js'

export default {
  components: {
    Logo
  },
  data: function() {
    return {
      name: localStorage.name || '',
      challange: localStorage.challange || '',
      messages: [],
      users: {},
      odd: 100,
      form: {
        name: '',
      },
    };
  },
  beforeMount () {
    // socket.on('new-message', (message) => {
    //   this.messages.push(message)
    // })
    socket.on('user-joined', (user) => {
      if (!this.users[user.userName]) {
        this.users[user.userName] = user;
      }
      console.log('USER JOINED ::', user);
    })
  },
  mounted() {
    this.join();
  },
  methods: {
    makeName() {
      var result           = '';
      var characters       = 'abcdefghijklmnopqrstuvwxyz';
      var charactersLength = characters.length;
      result += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(Math.random() * 26));
      for ( var i = 0; i < 5; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    },
    startChallange() {
      var name = this.makeName();
      this.challange = name;
      localStorage.challange = name;
    },
    addName(e) {
      e.preventDefault();
      this.name = this.form.name;
      localStorage.name  = this.form.name;
    },
    resign() {
      this.challange = '';
      localStorage.challange  = '';
    },
    signOut() {
      this.name = '';
      localStorage.name  = '';
    },
    join() {
      const message = {
        userName: this.name,
        date: new Date().toJSON(),
      }
      socket.emit('join', message)
    },
    sendMessage() {
      if (!this.message.trim()) { return }
      const message = {
        userName: this.name,
        date: new Date().toJSON(),
        text: this.message.trim()
      }
      this.messages.push(message)
      this.message = ''
      socket.emit('send-message', message)
    },
  }
}
</script>

<style>
.header {
  background-color: #40b881;
  color: white;
  margin-bottom: 5rem;
  padding: .5rem;
  justify-content: space-between;
  align-items: center;
}
.sidebar {
  background-color: #1e344c;
  color: white;
  height: 100vh;
}
.sign-out {
  border: 1px solid;
  background: transparent;
}
.name-header {
  margin: 10px auto;
  background-color: #35495E;
  margin: 10px auto;
  border-radius: 7PX;
  text-align: center;
}
.user-list-con {
  margin: 15px;
}
.user-list {
  width: 100%;
}
.tic-container {
  background-color: #35495E;
  color: white;
  display: flex;
  flex-wrap: wrap;
  margin: auto;
}
.user-container {
  margin-top: 5rem;
  border-top: 1px solid black;
  padding: 1rem;
  background-color: #40b882;
}
.user {
  background-color: #3b806f;
  margin: .5rem;
  color: white;
}
.middle {
  margin: auto;
}
.flex-middle {
  display: flex;
  justify-content: center;
}
.tic-container .row{
  margin: 0;
}
.tic-container .tic-cell {
  display: flex;
  padding: 2rem 1rem;
  text-align: center;
  align-items: center;
  justify-content: center;
  outline: 1px solid white;
}
</style>
