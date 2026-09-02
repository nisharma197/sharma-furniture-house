async function testApi() {
  const baseUrl = "http://localhost:5000/api";
  console.log("--- TESTING BACKEND ENDPOINTS ---");

  const endpoints = [
    "/gallery",
    "/services",
    "/projects",
    "/testimonials",
    "/faqs",
    "/settings"
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(`${baseUrl}${ep}`);
      const data = await res.json();
      const count = Array.isArray(data.data) ? data.data.length : Object.keys(data.data || {}).length;
      console.log(`✅ GET ${ep} -> Status: ${res.status}, Count: ${count}`);
    } catch (err) {
      console.error(`❌ GET ${ep} -> Error:`, err.message);
    }
  }
}

testApi();
