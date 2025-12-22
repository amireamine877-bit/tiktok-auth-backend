import axios from "axios";

export async function getMetaCampaigns(token, accountId) {
  const url = `https://graph.facebook.com/v20.0/act_${accountId}/campaigns`;

  const response = await axios.get(url, {
    params: {
      access_token: token,
      fields: "id,name,status"
    }
  });

  return response.data;
}
