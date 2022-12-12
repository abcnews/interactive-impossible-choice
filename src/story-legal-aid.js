const config = {
  id: "legal-aid--dev",
  labels: "What would you do?",
  questions: [
    {
      id: "lena",
      statement:
        "If you were in Lena’s situation, would you accept the default or fight the bank in court?",
      choices: ["Accept the default", "Fight it in court"],
    },
    {
      id: "anita",
      statement:
        "If you were in Anita and Chris’s situation, would you accept the default or fight the repossession in court?",
      choices: ["Accept the default", "Fight the repossession in court"],
    },
    {
      id: "tasha",
      statement:
        "If you were in Tasha’s situation, would you take the bank to court?",
      choices: ["Yes", "No"],
    },
    {
      id: "ana",
      statement:
        "If you were in Ana and Ganesh's position, would you accept the default or continue to fight on your own?",
      choices: ["Accept the default", "Go to court"],
    },
    {
      id: "michael",
      statement:
        "If you were in Michael’s situation, would you move on with your life, or represent yourself?",
      choices: ["Move on", "Be your own lawyer"],
    },
  ],
};

window.__IMPOSSIBLE_CHOICE_CONFIG__ = config;
