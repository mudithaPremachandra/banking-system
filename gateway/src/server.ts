import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  // Use backticks for template literals
  console.log(`API Gateway running on port ${PORT}`);
});