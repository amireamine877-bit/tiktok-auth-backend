export async function getTikTokCampaigns(accessToken) {
  try {
    const response = await fetch(
      "https://business-api.tiktok.com/open_api/v1.3/campaign/get/",
      {
        method: "POST",
        headers: {
          "Access-Token": accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          advertiser_id: process.env.TIKTOK_ADVERTISER_ID,
        }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("خطأ أثناء جلب الحملات:", error);
    return null;
  }
}
