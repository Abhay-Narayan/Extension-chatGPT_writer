import { useState, useEffect, useRef } from "react";
import frame from "@/assets/Frame.svg"; // Ensure this is the correct path
import vector from "@/assets/Vector.svg";
import regenerate from "@/assets/regenerate.svg";
import insert from "@/assets/insert.svg";

export default () => {
  const [show, setShow] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [convo, setConvo] = useState(false);
  const inputref = useRef<HTMLInputElement | null>(null);
  const [isFocused, setIsFocused] = useState(false); // Track if the input is focused manually

  const handleIconClick = () => {
    setShow(true);
    if (inputref.current) {
      inputref.current.focus();
      setIsFocused(true); // Track that the input is focused manually
    }
  };

  useEffect(() => {
    if (show && !isFocused && inputref.current) {
      inputref.current.focus(); // Focus input only if it wasn't manually focused
      setIsFocused(true); // Track that the input is focused
    }
  }, [show, isFocused]);

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleGenerate = () => {
    if (!prompt) alert("please enter a prompt to generate!");
    else {
      setConvo(true);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShow(false);
      if (inputref.current) {
        inputref.current.blur(); // Remove focus when overlay is clicked
        setIsFocused(false); // Track that the input lost focus
      }
    }
  };

  const handleInsert = () => {
    const inputField = document.querySelector(
      'div.msg-form__contenteditable[contenteditable="true"]'
    ) as HTMLElement;
    const para = inputField.querySelector("p");

    if (para) {
      para.innerText =
        "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";
      const inputEvent = new Event("input", { bubbles: true });
      inputField.dispatchEvent(inputEvent);
      setShow(false);
      setConvo(false);
      if (inputref.current) {
        inputref.current.blur(); // Remove focus after inserting text
        setIsFocused(false); // Track that the input lost focus
      }
    }
  };

  return (
    <div>
      {/* Button */}
      <div
        className="absolute bottom-0 right-0 mb-2 mr-2 cursor-pointer"
        onClick={handleIconClick} // Handle click event to show modal
      >
        <img
          src={frame} // Use the imported SVG file
          alt="Click me"
          className="w-[32px] h-[32px]" // Adjust size using Tailwind classes
        />
      </div>

      {/* Modal */}
      {show && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-[9999]"
          onClick={handleOverlayClick} // Handle click on the overlay to close modal
        >
          <div
            className="bg-[#F9FAFB] p-6 rounded-lg shadow-lg w-[500px] flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
          >
            {convo && (
              <div className="flex flex-col w-full gap-5">
                <div className="bg-[#DFE1E7] max-w-[77%] rounded-lg self-end p-2">
                  <p className="mx-auto" style={{ color: "#666D80"}}>{prompt}</p>
                </div>
                <div className="bg-[#DBEAFE] max-w-[77%] rounded-lg p-2">
                  <p className="mx-auto" style={{ color: "#666D80"}}>
                    Thank you for the opportunity! If you have any more
                    questions or if there's anything else I can help you with,
                    feel free to ask.
                  </p>
                </div>
              </div>
            )}
            <input
              type="text"
              ref={inputref}
              className="p-[10px] bg-white w-full"
              id="popup-input"
              placeholder="Your Prompt"
              value={prompt}
              onChange={handlePromptChange}
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                outline: "none",
                boxShadow: "none",
              }}
              onFocus={(e) => {
                e.target.style.outline = "none";
                e.target.style.boxShadow = "none";
                setIsFocused(true); // Track that input is focused manually
              }}
              onBlur={(e) => {
                e.target.style.outline = "none";
                e.target.style.boxShadow = "none";
                setIsFocused(false); // Track that input lost focus
              }}
            />
            <div className="flex justify-end w-full">
              {convo ? (
                <div className="flex items-center justify-end gap-2">
                  <button
                    id="generate-button"
                    className="py-2 px-4 flex items-center gap-3 font-medium text-[#666D80]  bg-transparent"
                    style={{
                      border: "1px solid #666D80",
                      borderRadius: "6px",
                    }}
                    onClick={handleInsert} // You can replace this with your logic
                  >
                    <img
                      src={insert} // Adjust the path to the actual location of your avatar icon
                      alt="Avatar Icon"
                      className="w-[12px] h-[14px]" // Adjust the size of the icon if necessary
                    />
                    Insert
                  </button>
                  <button
                    id="generate-button"
                    className="bg-[#3B82F6] text-white py-2 font-medium px-4 rounded-md cursor-pointer flex items-center gap-3"
                  >
                    <img
                      src={regenerate} // Adjust the path to the actual location of your avatar icon
                      alt="Avatar Icon"
                      className="w-[17px] h-[17px]" // Adjust the size of the icon if necessary
                    />
                    Regenerate
                  </button>
                </div>
              ) : (
                <button
                  id="generate-button"
                  className="bg-[#3B82F6] text-white font-medium py-2 px-4 rounded-md cursor-pointer flex items-center gap-3"
                  onClick={handleGenerate} // You can replace this with your logic
                >
                  <img
                    src={vector} // Adjust the path to the actual location of your avatar icon
                    alt="Avatar Icon"
                    className="w-[17px] h-[17px]" // Adjust the size of the icon if necessary
                  />
                  Generate
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
