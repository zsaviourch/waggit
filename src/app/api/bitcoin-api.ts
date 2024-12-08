import axios from "axios";

export const fetchBitcoinPrice = async (): Promise<number> => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    );
    return response.data.bitcoin.usd;
  } catch (err) {
    throw new Error("Failed to fetch Bitcoin price");
  }
};
