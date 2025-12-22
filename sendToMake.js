const axios = require('axios');

async function sendTestData() {
  try {
    const webhookUrl = "ضع_رابط_الويبهوك_هنا";

    const payload = {
      name: "Campaign A",
      ctr: 3.4,
      cpm: 2.5,
      cpc: 0.20,
      roas: 1.8,
      spend: 15.4,
      impressions: 5100,
      conversions: 5,
      sales: 50
    };

    const res = await axios.post(webhookUrl, payload);

    console.log("تم الإرسال بنجاح!");
    console.log("Response:", res.data);

  } catch (error) {
    console.error("خطأ أثناء الإرسال:", error);
  }
}

sendTestData();
