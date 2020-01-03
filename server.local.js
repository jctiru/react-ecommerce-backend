const app = require("./server");
const port = process.env.PORT || 5000;

app.listen(port, error => {
  if (error) throw error;
  console.log("Server running on port " + port);
});
