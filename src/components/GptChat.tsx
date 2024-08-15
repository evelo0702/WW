import { useEffect, useState } from "react";
interface Props {
  summary: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
}
const apiKey = import.meta.env.VITE_OPENAI_KEY;
const GptChat: React.FC<Props> = ({ summary, setComment }) => {
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const url = "https://api.openai.com/v1/chat/completions"; // GPT-3.5 Turbo API에 맞게 URL 수정

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: summary }], // 대화 형식으로 변경
        max_tokens: 500,
        temperature: 0.7,
      }),
    };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        // 응답 상태가 OK가 아닌 경우 에러 처리
        const errorData = await response.json();
        setError(`Error: ${errorData.error.message}`);
        setComment(""); // 이전 응답 지우기
        return;
      }

      const data = await response.json();
      setComment(data.choices[0].message.content.trim()); // GPT-3.5 Turbo 응답 처리
      setError(""); // 에러 초기화
    } catch (err) {
      setError("Request failed. Please try again.");
      setComment(""); // 이전 응답 지우기
    }
  };
  useEffect(() => {
    if (summary) {
      console.log("load gpt");
      handleSubmit();
    }
  }, [summary]);

  return (
    <div>
      {/* <button onClick={handleSubmit}>전송</button> */}
      {error && <p style={{ color: "red" }}>응답 에러: {error}</p>}{" "}
      {/* 에러 메시지 표시 */}
    </div>
  );
};

export default GptChat;
