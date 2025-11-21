import axios from "axios";


interface MsgProps {
  text: string;
  destinations: string[];
}

const sms_key = process.env.SMS_API_KEY!;
const endPoint = process.env.SMS_ENDPOINT!;

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Key ${sms_key}`,
};

// 🧠 Helper function to auto-format Ghana numbers
function formatGhanaNumber(num: string): string {
  // Remove spaces, plus signs, and non-numeric characters
  let cleanNum = num.replace(/\D/g, "");

  if (cleanNum.startsWith("0")) {
    // Convert local number (e.g., 0551234567 → 233551234567)
    cleanNum = "233" + cleanNum.slice(1);
  } else if (cleanNum.startsWith("233")) {
    // Already correct
    cleanNum = cleanNum;
  } else if (cleanNum.startsWith("+233")) {
    // Remove +
    cleanNum = cleanNum.slice(1);
  }

  return cleanNum;
}

export async function smsConfig(values: MsgProps) {
  try {
    const { text, destinations } = values;

    // Format all numbers correctly
    const formattedNumbers = destinations.map((num) => formatGhanaNumber(num));

    const msgData = {
      text,
      type: 0,
      sender: "MediText", // ✅ Use an approved sender name
      destinations: formattedNumbers,
    };

    const response = await axios.post(endPoint, msgData, { headers });

    if (response.status === 200 || response.status === 201) {
      console.info(`✅ SMS Sent Successfully: ${JSON.stringify(response.data)}`);
    } else {
      console.error(`❌ SMS Failed: ${JSON.stringify(response.data)}`);
    }

    return response.data;
  } catch (error: any) {
    console.error(`❌ SMS Error: ${error.message || error}`);
    throw error;
  }
}
