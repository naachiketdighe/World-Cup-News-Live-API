const port = process.env.port || 8000;
// default port
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { append } = require("express/lib/response");
const app = express();

const articles = [
  {
    Name: "Sporting News",
    address: "https://www.sportingnews.com/us/soccer",
    base: "https://www.sportingnews.com",
  },

  {
    Name: "ESPN",
    address: "https://www.espn.com/soccer/",
    base: "http://www.espn.com",
  },
  {
    Name: "Guardian",
    address: "https://www.theguardian.com/football",
    base: "",
  },
  {
    Name: "Sky Sports",
    address: "https://www.skysports.com/football",
    base: "",
  },
  {
    Name: "Goal",
    address: "https://www.goal.com/en-us",
    base: "",
  },
  {
    Name: "ESPN",
    address: "https://www.espn.com/soccer/league/_/name/fifa.world",
    base: "",
  },
  {
    Name: "CNN",
    address: "https://www.cnn.com/specials/football/fifa-world-cup-qatar-2022",
    base: "",
  },
];

const sport = [];

// i.e for each article or item in the array articles
articles.forEach((article) => {
  // get the url
  axios
    .get(article.address)
    //async
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("World")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        sport.push({
          title,
          url: article.base + url,
          source: article.Name,
        });
      });
    });
});
// we use nodemon to listen for all the changes made on the port
app.get("/", (req, res) => {
  res.json("Welcome to Nachi's API");
});

// Make changes on localhost:8000/news
app.get("/news", (req, res) => {
  // export the data that we earlier pushed into the sport arrray
  res.json(sport);
  // use axios to connect to Soccer News server
  // axios.get("https://www.cbssports.com/soccer/")
  // .then((response) => {
  //     // get the data from the server
  //     const html = response.data
  //     // use cheerio to generate HTML output
  //     const $ = cheerio.load(html)

  //     $('a:contains("Champions League")',html).each(function (){
  //         const title = $(this).text()
  //         const url = $(this).attr('href')
  //         sport.push({title,url
  //         })
  //     })
  //     res.json(sport)
  // }).catch((err) => {console.log(err)});
});

app.get("/news/:articleID", async (req, res) => {
  const articleID = req.params.articleID;
  const articleAddress = articles.filter(
    (article) => article.Name == articleID
  )[0].address;
  const articleBase = articles.filter((article) => article.Name == articleID)[0]
    .base;

  console.log(articleAddress);

  axios
    .get(articleAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const SpecificSport = [];

      $('a:contains("World")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");

        SpecificSport.push({
          title,
          url: articleBase + url,
          source: articleID,
        });
      });
      res.json(SpecificSport);
    })
    .catch((err) => {
      console.log(err);
    });
});
// listening to any changes or events on the port (8000)
app.listen(port, () => console.log("server listening on port " + port));
