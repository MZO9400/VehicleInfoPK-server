const app = require("./express");
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is listenting to port ${port}`));
