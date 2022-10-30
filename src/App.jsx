import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import axios from "axios";
import { API_URL } from "./constants";

function App() {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [img, setImg] = useState("");

  const send = async () => {
    if (!prompt || generating) {
      return;
    }

    setGenerating(true);

    const resp = await axios.get(API_URL, {
      params: { s: prompt },
      responseType: "arraybuffer",
    });

    const bytes = resp.data;
    const arrayBufferView = new Uint8Array(bytes);
    console.log(resp.data);
    const blob = new Blob([arrayBufferView], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    setImg(url);

    setGenerating(false);
  };

  const downloadImg = () => {
    if (!img) {
      return;
    }

    const link = document.createElement("a");
    link.href = img;
    link.setAttribute("download", "image.png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="App">
      <h2>Spritesheet Generator</h2>
      <br />
      <label>Prompt</label>
      <br />
      <textarea
        rows={4}
        cols={100}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <br />
      <br />
      <button onClick={send}>{generating ? "Generating" : "Generate"}</button>
      <br />
      <br />
      {img && (
        <div>
          {" "}
          <img src={img} />
          <br />
          <button onClick={downloadImg}>Download</button>
        </div>
      )}
    </div>
  );
}

export default App;
