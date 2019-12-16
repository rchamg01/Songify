const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
var cors = require("cors");
var neo4j = require("neo4j-driver").v1;
var driver = neo4j.driver(
  "bolt://localhost",
  neo4j.auth.basic("neo4j", "1234")
);

var session = driver.session();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//driver.close();

app.post("/getTracks", function(req, res) {
  var artist = req.body.artist;
  var track = req.body.track;
  var artist = req.body.artist;
  var order = req.body.order;
  var genre = req.body.genre;
  var top = req.body.top;
  var query = "";
  var result = [];

  if (artist == "") {
    query = query.concat("MATCH (t:track) -[* 1] - (a: artist)");
  } else {
    query = query.concat(
      "MATCH (t:track) -[* 1] - (a: artist) WHERE a.name =~ '(?i).*" +
        artist +
        ".*'"
    );
  }

  if (genre != "All" && artist == "") {
    query = query.concat(" WHERE t.genre = '" + genre + "'");
  } else if (genre != "All" && artist != "") {
    query = query.concat(" AND t.genre = '" + genre + "'");
  }

  if (
    (track != "" && artist != "") ||
    (genre != "All" && track != "") ||
    (artist != "" && genre != "All")
  ) {
    query = query.concat(" AND  t.name =~ '(?i).*" + track + ".*'");
  } else if (genre == "All" && artist == "" && track != "") {
    query = query.concat(" WHERE  t.name =~ '(?i).*" + track + ".*'");
  }

  if (top == "none") {
    if (order != "default" && order != "name") {
      query = query.concat(" RETURN t,a.name ORDER BY t." + order + " DESC");
    } else if (order == "name") {
      query = query.concat(" RETURN t,a.name ORDER BY t." + order);
    } else {
      query = query.concat(" RETURN t,a.name");
    }

    if (artist == "" && track == "" && genre == "All" && order == "default") {
      query = "";
    }
  } else {
    if (order != "default" && order != "name") {
      query = query.concat(
        " RETURN t,a.name ORDER BY t." + order + " DESC LIMIT " + top
      );
    } else if (order == "name") {
      query = query.concat(
        " RETURN t,a.name ORDER BY t." + order + " LIMIT " + top
      );
    } else {
      query = query.concat(" RETURN t,a.name LIMIT " + top);
    }

    if (artist == "" && track == "" && genre == "All" && order == "default") {
      query = "";
    }
  }

  console.log(query);

  session
    .run(query)

    // query = "MATCH (t:track) -[* 1] - (a: artist) WHERE a.name =~ '(?i).*"+ artist +".*' AND  t.name =~ '(?i).*" + track + ".*'  AND t.genre = '" + genre + "' RETURN t,a.name";

    .subscribe({
      onNext: function(record) {
        //  console.log(record.get(0));
        var element = record.get(0).properties;
        element.artist = record.get(1);
        result.push(element);
      },
      onCompleted: function() {
        res.send(result);
        session.close();
      },
      onError: function(error) {
        console.log(error);
      }
    });
});

app.post("/getRecTracks", function(req, res) {
  var genre = req.body.genre;
  var recommend = req.body.recommend;
  var top = req.body.top;
  var result = [];
  var query = "MATCH (t:track) -[* 1] - (a: artist) WHERE ";

  if (genre != "All") {
    query = query.concat("t.genre = '" + genre + "' AND ");
  }

  if (recommend == "danceable") {
    query = query.concat(
      "t.danceability > 0.75 RETURN t,a.name ORDER BY t.danceability DESC"
    );
  }

  if (recommend == "joyful") {
    query = query.concat(
      "t.valence > 0.55 RETURN t,a.name ORDER BY t.valence DESC"
    );
  }

  if (recommend == "sad") {
    query = query.concat("t.valence < 0.35 RETURN t,a.name ORDER BY t.valence");
  }

  if (recommend == "calm") {
    query = query.concat(
      "t.energy < 0.35 AND t.energy > 0.001 AND t.loudness < -15.0 RETURN t,a.name ORDER BY t.energy"
    );
  }

  if (recommend == "lively") {
    query = query.concat(
      "t.energy > 0.75 AND t.tempo > 110.0 RETURN t,a.name ORDER BY t.tempo DESC"
    );
  }

  if (recommend == "noisey") {
    query = query.concat(
      "t.loudness > -10 AND t.energy > 0.75 RETURN t,a.name ORDER BY t.loudness DESC"
    );
  }

  if (recommend == "live") {
    query = query.concat(
      "t.liveness > 0.80 RETURN t,a.name ORDER BY t.liveness DESC"
    );
  }

  if (recommend == "popular") {
    query = query.concat(
      "t.popularity > 70 RETURN t,a.name ORDER BY t.popularity DESC"
    );
  }

  if (recommend == "instrumental") {
    query = query.concat(
      "t.instrumentalness > 0.55 RETURN t,a.name ORDER BY t.instrumentalness DESC"
    );
  }

  if (recommend == "unknown") {
    query = query.concat(
      "t.popularity < 0.40 RETURN t,a.name ORDER BY t.popularity"
    );
  }

  if (top != "none") {
    query = query.concat(" LIMIT " + top);
  } else {
    query = query.concat(" RETURN t,a.name");
  }

  console.log(query);

  session
    .run(query)

    // query = "MATCH (t:track) -[* 1] - (a: artist) WHERE a.name =~ '(?i).*"+ artist +".*' AND  t.name =~ '(?i).*" + track + ".*'  AND t.genre = '" + genre + "' RETURN t,a.name";

    .subscribe({
      onNext: function(record) {
        //  console.log(record.get(0));
        var element = record.get(0).properties;
        element.artist = record.get(1);
        result.push(element);
      },
      onCompleted: function() {
        res.send(result);
        session.close();
      },
      onError: function(error) {
        console.log(error);
      }
    });
}),
  app.listen(port, function() {
    console.log("Example app listening on port " + 3000);
  });
