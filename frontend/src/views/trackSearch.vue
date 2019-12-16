<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card :text="items.text" color="green" title="Track search">
          <v-container>
            <v-layout wrap>
              <v-flex xs3>
                <v-text-field
                  v-model="searchArtist"
                  class="mr-4 purple-input"
                  label="By artist"
                  color="purple"
                  @keyup.enter="send"
                />
              </v-flex>
              <v-flex xs3>
                <v-text-field
                  v-model="searchSong"
                  class="mr-4 purple-input"
                  label="By track name"
                  color="purple"
                  @keyup.enter="send"
                />
              </v-flex>

              <v-flex xs3>
                <v-combobox
                  v-model="genre"
                  dense
                  :items="genres"
                  label="genre"
                  @keyup.enter="send"
                />
              </v-flex>
              <v-flex xs3>
                <v-combobox
                  v-model="value"
                  dense
                  :items="orders"
                  label="order by"
                  @keyup.enter="send"
                />
              </v-flex>
              <v-flex xs3>
                <v-btn class="mx-0 font-weight-light" color="success" @click="send">Search</v-btn>
              </v-flex>
              <v-flex xs3>
                <v-btn color="primary" dark @click.stop="dialog = true">RECOMMEND ME!</v-btn>

                <v-dialog v-model="dialog" max-width="600px">
                  <v-stepper v-model="e1">
                    <v-stepper-header>
                      <v-stepper-step :complete="e1 > 1" step="1">Select genre</v-stepper-step>

                      <v-divider></v-divider>

                      <v-stepper-step :complete="e1 > 2" step="2">Select mood</v-stepper-step>

                      <v-divider></v-divider>

                      <v-stepper-step step="3">Track number</v-stepper-step>
                    </v-stepper-header>

                    <v-stepper-items>
                      <v-stepper-content step="1">
                        <v-card class="mb-5" color="grey lighten-5" height="200px">
                          <v-container>
                            <v-card-text class="headline">Choose a genre:</v-card-text>
                            <v-select dense v-model="genreRec" :items="genres" label="Genre"></v-select>
                          </v-container>
                        </v-card>
                        <v-layout>
                          <v-btn depressed color="grey" @click.stop="dialog = false">Cancel</v-btn>
                          <v-spacer></v-spacer>

                          <v-btn depressed color="primary" @click="e1 = 2">Continue</v-btn>
                        </v-layout>
                      </v-stepper-content>

                      <v-stepper-content step="2">
                        <v-card class="mb-5" color="grey lighten-5" height="200px">
                          <v-container>
                            <v-flex md12>
                              <v-card-text class="headline">Choose a mood:</v-card-text>
                              <v-radio-group v-model="recommend" row>
                                <v-radio color="purple" label="danceable" value="danceable"></v-radio>
                                <v-radio color="purple" label="joyful" value="joyful"></v-radio>
                                <v-radio color="purple" label="sad" value="sad"></v-radio>
                                <v-radio color="purple" label="calm" value="calm"></v-radio>
                                <v-radio color="purple" label="lively" value="lively"></v-radio>
                                <v-radio color="purple" label="noisey" value="noisey"></v-radio>
                                <v-radio color="purple" label="live" value="live"></v-radio>
                                <v-radio color="purple" label="popular" value="popular"></v-radio>
                                <v-radio color="purple" label="instrumental" value="instrumental"></v-radio>
                                <v-radio color="purple" label="unknown" value="unknown"></v-radio>
                              </v-radio-group>
                            </v-flex>
                          </v-container>
                        </v-card>
                        <v-layout>
                          <v-btn depressed color="grey" @click.stop="dialog = false">Cancel</v-btn>
                          <v-spacer></v-spacer>
                          <v-btn depressed color="primary" @click="e1 = 1">back</v-btn>
                          <v-btn depressed color="primary" @click="e1 = 3">Continue</v-btn>
                        </v-layout>
                      </v-stepper-content>

                      <v-stepper-content step="3">
                        <v-card class="mb-5" color="grey lighten-5" height="200px">
                          <v-container>
                            <v-card-text class="headline">Select a limit of tracks:</v-card-text>
                            <v-select dense v-model="topRec" :items="limit" label="top tracks"></v-select>
                          </v-container>
                        </v-card>
                        <v-layout>
                          <v-btn depressed color="grey" @click.stop="dialog = false">Cancel</v-btn>
                          <v-spacer></v-spacer>
                          <v-btn depressed color="primary" @click="e1 = 2">back</v-btn>
                          <v-btn depressed color="primary" @click="sendRec()">Continue</v-btn>
                        </v-layout>
                      </v-stepper-content>
                    </v-stepper-items>
                  </v-stepper>
                </v-dialog>
              </v-flex>

              <v-flex xs3>
                <v-hover v-model="buttonHovering">
                  <v-btn icon color="rgb(255,255,255,0)" depressed slot-scope="{ hover }">
                    <v-tooltip right v-model="showToolTip" :disabled="!buttonHovering">
                      <v-icon slot="activator" color="grey">mdi-help-circle-outline</v-icon>
                      <span>
                        Click on the
                        <b>Audio Features</b> tab to know
                        more!
                      </span>
                    </v-tooltip>
                  </v-btn>
                </v-hover>
              </v-flex>
              <v-flex xs3>
                <v-combobox
                  v-model="top"
                  dense
                  :items="limit"
                  label="top tracks"
                  @keyup.enter="send"
                />
              </v-flex>
            </v-layout>
          </v-container>
          <v-container fluid grid-list-md text-xs-center>
            <v-layout wrap fill-height>
              <v-flex v-for="item in items" :key="item.id" d-flex xs3>
                <v-hover>
                  <v-card class="mx-auto" slot-scope="{ hover }">
                    <v-img height="380px">
                      <iframe
                        :src="item.src"
                        width="280"
                        height="380"
                        frameborder="0"
                        allowtransparency="true"
                        allow="encrypted-media"
                      />

                      <v-expand-transition>
                        <div
                          v-if="hover"
                          class="d-flex transition-fast-in-fast-out black v-card--reveal body-2 font-weight-light white--text"
                          style="height: 79%;"
                        >
                          <br />
                          Genre: {{ item.genre }}
                          <br />
                          Popularity:
                          {{ item.popularity }}
                          <br />
                          Mode: {{ item.mode }}
                          <br />
                          Key: {{ item.key }}
                          <br />
                          Tempo:
                          {{ item.tempo }} (bpm)
                          <br />
                          Acousticness:
                          {{ item.acousticness }}
                          <br />
                          Energy:
                          {{ item.energy }}
                          <br />
                          Instrumentalness:
                          {{ item.instrumentalness }}
                          <br />
                          Liveness:
                          {{ item.liveness }}
                          <br />
                          Loudness:
                          {{ item.loudness }} (dB)
                          <br />
                          Speechiness:
                          {{ item.speechiness }}
                          <br />
                          Time signature:
                          {{ item.time_signature }}
                          <br />
                          Valence:
                          {{ item.valence }}
                          <br />
                          Danceability:
                          {{ item.danceability }}
                          <br />

                          <br />
                        </div>
                      </v-expand-transition>
                    </v-img>
                    <v-card-title class="justify-center" primary-title>
                      <div>
                        <div class="headline font-weight-light mb-2">{{ item.name }}</div>
                        <span class="grey--text">{{ item.artist }}</span>
                      </div>
                    </v-card-title>
                  </v-card>
                </v-hover>
              </v-flex>
            </v-layout>
          </v-container>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    tracks: [],
    headers: [
      {
        text: "Name",
        value: "name"
      },
      {
        text: "Artist",
        value: "artist"
      },
      {
        text: "Genre",
        value: "genre"
      },
      {
        text: "Tempo",
        value: "tempo"
      },
      {
        text: "Mode",
        value: "mode"
      },
      {
        text: "Popularity",
        value: "popularity"
      },
      {
        text: "Acousticness",
        value: "acousticness"
      },
      {
        text: "Energy",
        value: "energy"
      },
      {
        text: "Instrumentalness",
        value: "instrumentalness"
      },
      {
        text: "Key",
        value: "key"
      },
      { text: "Liveness", value: "liveness" },
      { text: "Loudness", value: "loudness" },
      { text: "Speechiness", value: "speechiness" },
      { text: "Time signature", value: "time_signature" },
      { text: "Valence", value: "valence" },
      { text: "Danceability", value: "danceability" }
    ],

    track: "",
    artist: "",
    order: "",
    alphabetical: "",
    genre: "All",

    genreRec: "All",
    topRec: "none",
    recommend: "unknown",

    genres: [
      "All",
      "Blues",
      "Indie",
      "Alternative",
      "Jazz",
      "Rock",
      "Soul",
      "Reggae",
      "Ska",
      "Folk"
    ],

    orders: [
      "default",
      "name",
      "popularity",
      "acousticness",
      "energy",
      "instrumentalness",
      "key",
      "liveness",
      "loudness",
      "mode",
      "speechiness",
      "tempo",
      "time_signature",
      "valence",
      "danceability"
    ],

    limit: ["1", "3", "5", "10", "25", "50", "none"],
    items: [],
    searchArtist: "",
    searchSong: "",
    value: "default",
    top: "none",
    show: false,
    noItems: false,
    e1: 0,
    dialog: false,
    buttonHovering: false,
    showToolTip: false
  }),

  methods: {
    send: function() {
      var datos = {
        track: this.searchSong,
        artist: this.searchArtist,
        order: this.value,
        alphabetical: this.alphabetical,
        genre: this.genre,
        top: this.top
      };

      this.$http.post("http://localhost:3000/getTracks", datos).then(
        response => {
          this.items = response.data;
          this.items.text = this.items.length + " result(s) found";
          for (var i = 0; i < this.items.length; i++) {
            this.items[i].src =
              "https://open.spotify.com/embed/track/" + this.items[i].id;
          }
        },
        response => {
          alert("Ha habido un error en el envío: " + response.data);
        }
      );
    },

    sendRec: function() {
      var datos = {
        recommend: this.recommend,
        genre: this.genreRec,
        top: this.topRec
      };
      this.$http.post("http://localhost:3000/getRecTracks", datos).then(
        response => {
          this.items = response.data;
          this.items.text = this.items.length + " result(s) found";

          for (var i = 0; i < this.items.length; i++) {
            this.items[i].src =
              "https://open.spotify.com/embed/track/" + this.items[i].id;
          }
        },
        response => {
          alert("Ha habido un error en el envío: " + response.data);
        }
      );
    }
  }
};
</script>
<style scoped>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.8;
  position: absolute;
  width: 100%;
}
</style>
