const blacklist = [
  "spam",
  "sexo",
  "sexy",
  "nigeria",
  "tonto",
  "gordo",
  "hackeado",
  "sex",
  "hack",
  "hacked",
  "hacker",
  "hacking",
  "one million dollars",
  "one million dollar",
  "one million",
];

const blacklistInterleaved = blacklist.reduce((acc, word) => {
  const lowerCaseWord = word.toLowerCase();
  return [...acc, lowerCaseWord, lowerCaseWord.toUpperCase()];
}, []);

const interleavedBlacklist = blacklist.map((word) => {
  let interleavedWord = "";
  for (let i = 0; i < word.length; i++) {
    interleavedWord +=
      i % 2 === 0 ? word[i].toUpperCase() : word[i].toLowerCase();
  }
  return interleavedWord;
});

export function isAntispam(inputValue) {
  // Verificar si el último carácter es un carácter especial y eliminarlo si es así
  const lastChar = inputValue.slice(-1);
  if (/\W/.test(lastChar)) {
    inputValue = inputValue.slice(0, -1);
  }

  const words = inputValue.toLowerCase().split(/\W+/);
  const allWords = [...words, ...words.map((word) => word.toUpperCase())];

  const forbiddenWords = [
    ...blacklist,
    ...blacklistInterleaved,
    ...interleavedBlacklist,
  ];

  const hasForbiddenWord = allWords.some((word) => {
    const regex = new RegExp(`\\b${word.split("").join("*")}\\b`);
    const forbiddenWord = forbiddenWords.some((forbiddenWord) =>
      regex.test(forbiddenWord)
    );
    return forbiddenWord;
  });

  return !hasForbiddenWord;
}
