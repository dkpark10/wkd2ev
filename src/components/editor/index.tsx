"use client";

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState, useRef, useEffect } from "react";
import { runTextEditorAction } from "@/utils/editor";
import { v4 as uuidv4 } from "uuid";
import type { Editor } from "types";

const buttonContents = ["bold", "inclination"] as const;

export default function EditorComponent() {
  const [currentEditorBlockId, setCurrentEditorBlockId] = useState("");
  const [editorBlocks, setEditorBlocks] = useState<Array<Editor.Block>>([
    {
      type: "text",
      id: uuidv4(),
    },
  ]);

  const textEditorBlockRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const onEditorBoundClick = () => {
    const lastTextEditorElement = Array.from(textEditorBlockRefs.current, ([key, ref]) => ({
      key,
      ref,
    })).slice(-1)[0];

    lastTextEditorElement.ref.focus();
    setCurrentEditorBlockId(lastTextEditorElement.key);
  };

  const onActionClick = (action: Editor.EditorAction) => () => {
    const currentContentDom = textEditorBlockRefs.current.get(currentEditorBlockId);
    if (!currentContentDom) return;

    runTextEditorAction(currentContentDom, action);
  };

  useEffect(() => {
    const firstTextEditorElementKey = Array.from(textEditorBlockRefs.current, ([key]) => key)[0];
    setCurrentEditorBlockId(firstTextEditorElementKey);
  }, []);

  return (
    <div className="absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]">
      <div className="border border-red-900 h-[50vh] w-[75vw]" onClick={onEditorBoundClick}>
        <div className="border border-stone-900 flex justify-between">
          {buttonContents.map((content) => (
            <button
              data-testid={`button-action-${content}`}
              className="border border-stone-900 w-24"
              key={content}
              type="button"
              onClick={onActionClick(content)}
            >
              {content}
            </button>
          ))}
        </div>
        {editorBlocks.map((block, idx) =>
          block.type === "text" ? (
            <div
              contentEditable
              key={block.id}
              data-block-id={block.id}
              data-testid={`editor-block${idx + 1}`}
              ref={(ref) => {
                if (!ref || textEditorBlockRefs.current.get(block.id)) return;
                textEditorBlockRefs.current.set(block.id, ref);

                // eslint-disable-next-line consistent-return
                return ref;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const selection = window.getSelection();
                  const range = selection?.getRangeAt(0);
                  const startContainer = range?.startContainer;
                  if (!selection || !range || !startContainer) return;

                  if (startContainer.parentElement?.getAttribute("contentEditable")) {
                    e.preventDefault();

                    const editorBlock = textEditorBlockRefs.current.get(block.id);
                    const div = document.createElement("div");
                    div.innerHTML = startContainer.textContent ?? "";

                    editorBlock?.firstChild?.replaceWith(div);

                    (editorBlock as HTMLDivElement).innerHTML += "<div><br></div>";
                    range.setStart(editorBlock?.firstChild?.nextSibling as Node, 0);
                    range.setEnd(editorBlock?.firstChild?.nextSibling as Node, 0);

                    selection.removeAllRanges();
                    selection.addRange(range);
                  }
                }
              }}
            >
              <div>1111111111</div>
              <div>2222222222</div>
              <div>3333333333</div>
              <div>4444444444</div>
              <div>5555555555</div>
              <div>6666666666</div>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={block.src} alt={`editor-img-${block.id}`} key={block.id} />
          ),
        )}
      </div>
    </div>
  );
}
