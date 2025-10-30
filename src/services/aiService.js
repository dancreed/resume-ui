import { urls } from "../styles/theme";

export class AIService {
  static async askQuestion(question) {
    const response = await fetch(urls.api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    
    if (!response.ok) {
      throw new Error(await response.text());
    }
    
    const result = await response.text();
    return result || "No answer returned.";
  }
}
