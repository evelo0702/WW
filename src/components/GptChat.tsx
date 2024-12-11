import { useEffect, useState } from "react";
interface Props {
  summary: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
}
const apiKey = import.meta.env.VITE_OPENAI_KEY;
const GptChat: React.FC<Props> = ({ summary, setComment }) => {
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const url = "https://api.openai.com/v1/chat/completions"; 
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: summary }], 
        max_tokens: 500,
        temperature: 0.7,
      }),
    };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {

        const errorData = await response.json();
        setError(`Error: ${errorData.error.message}`);
        setComment(""); 
        return;
      }

      const data = await response.json();
      setComment(data.choices[0].message.content.trim()); 
    } catch (err) {
      setError("Request failed. Please try again.");
      setComment(""); 
    }
  };
  useEffect(() => {
    if (summary) {
      console.log("load gpt");
      handleSubmit();
    }
  }, [summary]);

  return (
    <div>{error && <p style={{ color: "red" }}>응답 에러: {error}</p>} </div>
  );
};

export default GptChat;
