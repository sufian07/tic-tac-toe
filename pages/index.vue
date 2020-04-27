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
          </b-button-group>
        </b-row>
          <b-row v-if="challange">
            <b-col cols="2"></b-col>
            <b-col cols="8">
              <b-row>
                <div class="tic-container">
                    <b-col
                      v-for="cell in cells"
                      :key="cell"
                      cols="4"
                      @click="step(cell)"
                      class="tic-cell">
                      <span v-if="game[`field${cell}`]"> {{ game[`field${cell}`] }}</span>
                      <span class="hidden" v-else> x</span>
                    </b-col>
                </div>
              </b-row>
              <b-row class="user-container">
                <b-col class="user own">
                  <p></p>
                  <p>
                    You
                   <b-spinner
                    v-if="firstUser == game.currentStepper"
                    type="grow"
                    label="Spinning"></b-spinner>
                  </p>
                  <hr />
                  <p><b>Chance to win:</b> {{ odd }}%</p>
                </b-col>
                <b-col class="user other">
                  <div v-if="game.status == 'pending'">
                    Give your friend this link <span class="link">http://localhost:3000?game={{ game.name }}</span> to join
                  </div>
                  <div v-else>
                    <p></p>
                    <p>
                      Opposition
                      <b-spinner
                        v-if="secondUser == game.currentStepper"
                        type="grow" label="Spinning"></b-spinner>
                    </p>
                    <hr />
                    <p><b>Chance to win:</b> {{ oddOpposition }}%</p>
                  </div>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row v-else>
            <b-button
              class="middle"
              @click="startChallange"
              variant="success">Start Challange</b-button>
          </b-row>
      </b-col>
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
      cells: [1,2,3,4,5,6,7,8,9],
      challange: localStorage.challange || '',
      odd: 100,
      oddOpposition: 100,
      form: {
        name: '',
      },
      game: {},
      takingChallange: false,
      firstUser: localStorage.firstUser == 'true' || false,
      secondUser: localStorage.secondUser == 'true' || false,
    };
  },
  beforeMount () {
    const game = ((location.search || '').split('?')[1] || '').split("=");
    if(game[0] == 'game') {
      this.takingChallange = true;
      this.challange = game[1];
      this.firstUser = false;
      this.secondUser = true;

      localStorage.challange = this.challange;
      localStorage.firstUser = this.firstUser;
      localStorage.secondUser = this.secondUser;

      socket.emit('take-challange', {name: game[1]})
    }
    socket.on('game', (game) => {
      console.log("GAME :: ", game);
      this.game = game;
      if (this.name == this.game.firstUser) {
        this.game.otherUser = this.game.secondUser;
      }
      this.challange = game.name;
      localStorage.challange = game.name;
    })
  },
  mounted() {
    if (!this.takingChallange) {
      this.join();
    }
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
      this.firstUser = true;
      this.secondUser = false;

      localStorage.challange = name;
      localStorage.firstUser = true;
      localStorage.secondUser = false;

      socket.emit('make-challange', {
        name: name,
      })
    },
    addName(e) {
      e.preventDefault();
      this.name = this.form.name;
      localStorage.name  = this.form.name;
    },
    step(cell) {
      console.log(cell);
    },
    resign() {
      this.challange = '';
      localStorage.challange  = '';
      socket.emit('resign-challange', {
        id: this.game.id,
      })
    },
    signOut() {
      this.name = '';
      localStorage.name  = '';
      this.resign();
    },
    join() {
      const data = {
        challange: this.challange,
        date: new Date().toJSON(),
      }
      socket.emit('join', data)
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
.spinner-grow {
  width: 1rem;
  height: 1rem;
  margin-left: 1rem;
}
.hidden {
  visibility: hidden;
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
.link {
  color: blue
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
  font-size: 2rem;
  padding: 2rem 1rem;
  text-align: center;
  align-items: center;
  justify-content: center;
  outline: 1px solid white;
}
</style>
