import { whenOdysseyLoaded } from "@abcnews/env-utils";
import "./story-child-protection.scss";

const config = {
  id: "child-protection",
  labels: "What would you do?",
  questions: [
    {
      id: "jakob",
      statement: "Would you remove Jakob from Amanda's care?",
      choices: ["Yes", "No"],
      source: {
        name: "Benevolent Society practice resources",
        url: "https://www.benevolent.org.au/think/practice--resources",
      },
    },
    {
      id: "abby",
      statement: "Would you remove Abby from Bree's care?",
      choices: ["Yes", "No"],
      source: {
        name: "South Australian child protection systems Royal Commission report",
        url: "http://www.agd.sa.gov.au/sites/agd.sa.gov.au/files/documents/CPRC/CPSRC_VOLUME%202_case%20studies.pdf",
      },
    },
    {
      id: "ayden-chloe",
      statement: "Would you remove Ayden and Chloe from Tiffany's care?",
      choices: ["Yes", "No"],
      source: {
        name: "Professor Paul Harnett, University of Queensland",
        url: "",
      },
    },
    {
      id: "tom-jade",
      statement: "Would you remove Tom and Jade from Belle's care?",
      choices: ["Yes", "No"],
      source: {
        name: "Department of communities, child safety and disability services, Queensland",
        url: "http://www.childprotectioninquiry.qld.gov.au/__data/assets/pdf_file/0018/176022/Department_of_Communities_Child_Safety_and_Disability_Services.pdf",
      },
    },
    {
      id: "jackson",
      statement: "Would you remove Jackson from Amy's care?",
      choices: ["Yes", "No"],
      source: {
        name: "Department of communities, child safety and disability services, Queensland",
        url: "http://www.childprotectioninquiry.qld.gov.au/__data/assets/pdf_file/0018/176022/Department_of_Communities_Child_Safety_and_Disability_Services.pdf",
      },
    },
    {
      id: "james",
      statement: "Would you remove James from Fiona and Gary's care?",
      choices: ["Yes", "No"],
      source: {
        name: "South Australian child protection systems Royal Commission report",
        url: "http://www.agd.sa.gov.au/sites/agd.sa.gov.au/files/documents/CPRC/CPSRC_VOLUME%202_case%20studies.pdf",
      },
    },
  ],
};

window.__IMPOSSIBLE_CHOICE_CONFIG__ = config;

// Re-mount heading illustrations

whenOdysseyLoaded.then(() => {
  [...document.querySelectorAll("h2 + img, h2 + figure")].forEach((el) => {
    const headingEl = el.previousSibling;
    const textContainerEl = document.createElement("span");
    const imgEl = el.querySelector("img") || el;
    const imgContainerEl = document.createElement("span");

    textContainerEl.textContent = headingEl.textContent;
    headingEl.textContent = "";
    headingEl.insertBefore(textContainerEl, headingEl.firstChild);
    el.parentNode.removeChild(el);
    imgContainerEl.appendChild(imgEl);
    headingEl.insertBefore(imgContainerEl, headingEl.firstChild);
  });
});
