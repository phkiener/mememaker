export {}

type templateDefinition = {
    templates: template[]
}

type template = {
    title: string,
    image: string
}

const response = await fetch("/data/templates.json");
if (response.ok) {
    const defs = await response.json() as templateDefinition;
    console.log(`Loaded ${defs.templates.length} templates`);
}

console.log("Mememaker ready.")
