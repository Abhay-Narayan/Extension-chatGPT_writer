import "./style.css";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

export default defineContentScript({
  matches: ["*://www.linkedin.com/messaging/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "wxt-react-example",
      position: "inline",
      anchor: "body",
      append: "first",

      onMount: (container) => {
        const observer = new MutationObserver(() => {
          const inputField = document.querySelector(
            'div.msg-form__contenteditable[contenteditable="true"]'
          ) as HTMLElement;

          if (inputField) {
            observer.disconnect(); // Stop observing once input field is found

            let root: ReactDOM.Root | null = null;
            let wrapper: HTMLDivElement | null = null;

            // Handle focus event to show the React app
            inputField.addEventListener("focus", () => {
              if (!root && !wrapper) {
                ({ root, wrapper } = insertReactApp(inputField)); // Mount React app on focus
              }
            });

            // Handle blur event to hide the React app
            inputField.addEventListener("blur", (event) => {
              setTimeout(() => {
                if (
                  wrapper &&
                  !wrapper.contains(event.relatedTarget as Node) && // If focus is outside the React app
                  !document.activeElement?.closest(".react-app-container") // And not inside the app
                ) {
                  root?.unmount(); // Unmount the React app
                  wrapper.remove(); // Remove wrapper
                  root = null; // Reset root
                  wrapper = null; // Reset wrapper
                }
              }, 100); // Small timeout to ensure clicks on the React app are detected
            });
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        function insertReactApp(inputField: HTMLElement) {
          // Create a sibling div to mount the React app next to the input field
          const wrapper = document.createElement("div");
          wrapper.classList.add("react-app-container"); // Add class for easy reference
          inputField.parentElement?.insertBefore(wrapper, inputField.nextSibling);

          // Render the React app inside this wrapper
          const root = ReactDOM.createRoot(wrapper);
          root.render(<App />);

          return { root, wrapper };
        }
      },

      onRemove: (elements: any) => {
        elements?.root.unmount();
        elements?.wrapper.remove();
      },
    });

    ui.mount();
  },
});
