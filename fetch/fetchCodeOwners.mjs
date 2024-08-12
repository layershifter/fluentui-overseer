const CODE_OWNERS_URL =
  "https://raw.githubusercontent.com/microsoft/fluentui/master/.github/CODEOWNERS";

async function fetchCodeOwners() {
  try {
    const response = await fetch(CODE_OWNERS_URL);
    const text = await response.text();

    console.log(text);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

await fetchCodeOwners();
