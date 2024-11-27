import React, { useEffect, useState } from "react";
import EditiorNavbar from "../components/EditiorNavbar";
import Editor from "@monaco-editor/react";
import { MdLightMode } from "react-icons/md";
import { RiExpandDiagonalLine } from "react-icons/ri";
import { api_base_url } from '../helper';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const Editior = () => {
  const [tab, setTab] = useState("html");
  const [isLightMode, setIsLightMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract projectID from URL using useParams
  const { projectID } = useParams();

  const changeTheme = () => {
    const editorNavbar = document.querySelector(".EditorNavbar");
    if (isLightMode) {
      editorNavbar.style.background = "#141414";
      document.body.classList.remove("lightMode");
      setIsLightMode(false);
    } else {
      editorNavbar.style.background = "#f4f4f4";
      document.body.classList.add("lightMode");
      setIsLightMode(true);
    }
  };

  const [htmlCode, setHtmlCode] = useState("<h1>Hello World</h1>");
  const [cssCode, setCssCode] = useState("h1 { background-color: #FF0000; }");
  const [jsCode, setJsCode] = useState("// JavaScript code here");

  const run = () => {
    const html = htmlCode; 
    const css = `<style>${cssCode}</style>`;
    const js = `<script>${jsCode}</script>`;
    const iframe = document.getElementById("iframe");
    iframe.srcdoc = html + css + js; 
  };

  useEffect(() => {
    run(); 
  }, [htmlCode, cssCode, jsCode]);

  useEffect(() => {

    fetch(api_base_url + "/getProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        projId: projectID
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
 
        setHtmlCode(data.project.htmlCode);
        setCssCode(data.project.cssCode);
        setJsCode(data.project.jsCode);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch project data. Please check your connection or try again later.");
      });
  }, [projectID]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault(); 

        fetch(api_base_url + "/updateProject", {
          mode: "cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userId"),
            projId: projectID,  
            htmlCode: htmlCode,  
            cssCode: cssCode,    
            jsCode: jsCode      
          })
        })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (data.success) {
            toast.success("Project saved successfully");
          } else {
            toast.error("Something went wrong");
          }
        })
        .catch((err) => {
          console.error("Error saving project:", err);
          toast.error("Failed to save project. Please try again.");
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [projectID, htmlCode, cssCode, jsCode]);

  return (
    <>
      <EditiorNavbar />
      <div className="flex">
        <div className={`left w-[${isExpanded ? "100%" : "50%"}]`}>
          <div className="tabs flex justify-between items-center w-full gap-2 bg-[#1A1919] h-[50px] px-[40px]">
            <div className="flex items-center gap-2 tabs">
              <div onClick={() => setTab("html")} className="tab p-[6px] bg-[#1E1E1E] px-[10px] text-[15px] cursor-pointer">HTML</div>
              <div onClick={() => setTab("css")} className="tab p-[6px] bg-[#1E1E1E] px-[10px] text-[15px] cursor-pointer">CSS</div>
              <div onClick={() => setTab("js")} className="tab p-[6px] bg-[#1E1E1E] px-[10px] text-[15px] cursor-pointer">JavaScript</div>
            </div>

            <div className="flex items-center gap-4 cursor-pointer">
              <i className="text-[20px]" onClick={changeTheme}>
                <MdLightMode />
              </i>
              <i className="text-[20px]" onClick={() => setIsExpanded(!isExpanded)}>
                <RiExpandDiagonalLine />
              </i>
            </div>
          </div>

          <Editor
            height="82vh"
            theme={isLightMode ? "vs-light" : "vs-dark"}
            language={tab}
            value={tab === "html" ? htmlCode : tab === "css" ? cssCode : jsCode}
            onChange={(value) => {
              if (tab === "html") {
                setHtmlCode(value || "");
              } else if (tab === "css") {
                setCssCode(value || "");
              } else {
                setJsCode(value || "");
              }
            }}
          />
        </div>

        {!isExpanded && (
          <iframe
            id="iframe"
            className="w-[50%] min-h-[82vh] bg-[#fff] text-black"
            title="output"
          />
        )}
      </div>
    </>
  );
};

export default Editior;
